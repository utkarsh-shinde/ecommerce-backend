import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";

import {
  NewProductRequest,
  ProductBaseQuery,
  ProductSearchRequest,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { el, faker } from "@faker-js/faker";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

export const handleNewProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequest>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, price, stock, category, desc } = req.body;
    console.log("request body :: " + req.body.name);
    const _photo = req.file;

    if (!_photo) return next(new ErrorHandler("Please add photo", 400));

    if (!name || !price || !stock || !category) {
      rm(_photo.path, () => console.log("photo deleted"));

      return next(new ErrorHandler("Please add all fields", 400));
    }

    let _product = await Product.create({
      name,
      price,
      stock,
      category: category?.toLowerCase(),
      desc,
      photo: _photo?.path,
    });

    // invalidates cache
    await invalidateCache({ product: true, productID: _product.id });

    return res.status(201).json({ success: true, _product });
  }
);

export const handleGetLatestProducts = TryCatch(async (req, res, next) => {
  let _latestProducts;

  if (myCache.has("latest-products")) {
    _latestProducts = JSON.parse(myCache.get("latest-products") as string);
    console.log("Reading from cache");
  } else {
    _latestProducts = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    myCache.set("latest-products", JSON.stringify(_latestProducts));
  }

  return res.status(200).json({ success: true, _latestProducts });
});

export const handleGetCategories = TryCatch(async (req, res, next) => {
  let _allCategories;
  if (myCache.has("category")) {
    _allCategories = JSON.parse(myCache.get("category") as string);
    console.log("Reading from cache");
  } else {
    _allCategories = await Product.distinct("category");
    myCache.set("category", JSON.stringify(_allCategories));
  }
  return res.status(200).json({ success: true, _allCategories });
});

export const handleGetAdminProducts = TryCatch(async (req, res, next) => {
  let _allProducts;
  if (myCache.has("allProducts")) {
    _allProducts = JSON.parse(myCache.get("allProducts") as string);
    console.log("Reading from cache");
  } else {
    _allProducts = await Product.find({});
    myCache.set("allProducts", _allProducts);
  }
  return res.status(200).json({ success: true, _allProducts });
});

export const handleGetProduct = TryCatch(async (req, res, next) => {
  const id = req.params.id;

  if (!id) return next(new ErrorHandler("Please provide ID", 400));

  let _product;
  if (myCache.has(`product-${id}`)) {
    _product = JSON.parse(myCache.get(`product-${id}`) as string);
    console.log("Reading from cache");
  } else {
    _product = await Product.findById(id);
    if (!_product) return next(new ErrorHandler("Product not found", 401));
    myCache.set(`product-${id}`, _product);
  }

  return res.status(200).json({ success: true, _product });
});

export const handleUpdateProduct = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const { name, price, stock, category } = req.body;
  const photo = req.file;

  if (!id) return next(new ErrorHandler("Please provide ID", 400));

  const _product = await Product.findById(id);
  if (!_product) return next(new ErrorHandler("Product not found", 401));

  // if photo updated than delete the old one and update path of new
  if (photo) {
    rm(_product.photo, () => {
      console.log(
        `Old photo deleted : _product.photo ${_product.photo} and New photo path ${photo.path}`
      );
    });
    _product.photo = photo.path;
  }

  if (name) _product.name = name;
  if (price) _product.price = price;
  if (stock) _product.stock = stock;
  if (category) _product.category = category;

  _product.save();
  // invalidates cache
  await invalidateCache({ product: true, productID: _product.id });

  return res
    .status(200)
    .json({ success: true, message: "Product update successfully" });
});

export const handleDeleteProduct = TryCatch(async (req, res, next) => {
  const id = req.params.id;

  if (!id) return next(new ErrorHandler("Please provide ID", 400));

  const _product = await Product.findById(id);
  if (!_product) return next(new ErrorHandler("Product not found", 401));

  _product.deleteOne();
  // invalidates cache
  await invalidateCache({ product: true, productID: _product.id });

  return res
    .status(200)
    .json({ success: true, message: "Product Deleted successfully" });
});

export const handleGetAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, ProductSearchRequest>, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: ProductBaseQuery = {};

    if (search) {
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (price) {
      baseQuery.price = {
        $lte: price,
      };
    }

    if (category) {
      baseQuery.category = category;
    }

    const productsPromise = await Product.find(baseQuery)
      .sort(sort && { price: sort == "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredOnlyProducts] = await Promise.all([
      productsPromise,
      Product.find(baseQuery),
    ]);

    const totalPages = Math.ceil(filteredOnlyProducts.length / limit);

    return res.status(200).json({ success: true, productsPromise, totalPages });
  }
);

// const generateRandomFakeData = async (count: number = 10) => {
//   const fakeProducts = [];
//   for (let id = 0; id < count; id++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads/1c891d02-302c-4325-b3ce-9a8db0b0fa16.png",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//     };

//     fakeProducts.push(product);
//   }
//   await Product.create(fakeProducts);
// };

//generateRandomFakeData(50);
