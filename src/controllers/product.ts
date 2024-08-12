import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";

import { NewProductRequest } from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";

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

    return res.status(200).json({ success: true, _product });
  }
);
