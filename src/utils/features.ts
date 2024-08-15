import mongoose from "mongoose";
import { InvalidateCacheType, OrderItemsType } from "../types/types.js";
import { Product } from "../models/product.js";
import { myCache } from "../app.js";
import ErrorHandler from "./utility-class.js";

export const ConnectDB = (uri: string) => {
  mongoose
    .connect(uri, { dbName: "EcommerceApp" })
    .then((c) => console.log("Mongo DB connected at  :: " + c.connection.host))
    .catch((e) => console.log(e));
};

export const invalidateCache = async ({
  product,
  order,
  admin,
}: InvalidateCacheType) => {
  if (product) {
    const productkeys: string[] = [
      "allProducts",
      "category",
      "latest-products",
    ];

    const productIds = await Product.find({}).select("_id");

    productIds.forEach((prod) => {
      productkeys.push(`product-${prod._id}`);
    });

    console.log("invalidateCache for products");
    myCache.del(productkeys);
  }
  if (order) {
  }
  if (admin) {
  }
};

export const reduceStock = async (orderItems: OrderItemsType[]) => {
  for (let index = 0; index < orderItems.length; index++) {
    const order = orderItems[index];

    const product = await Product.findById(order.productID);

    if (!product) throw new ErrorHandler("Product not found", 401);

    product.stock -= order.quantity;
    await product.save();
  }
};
