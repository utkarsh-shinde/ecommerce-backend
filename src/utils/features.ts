import mongoose from "mongoose";
import { InvalidateCacheType, OrderItemsType } from "../types/types.js";
import { Product } from "../models/product.js";
import { myCache } from "../app.js";
import ErrorHandler from "./utility-class.js";
import { stringify } from "querystring";

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
  productID,
  userID,
  orderID,
}: InvalidateCacheType) => {
  if (product) {
    const productkeys: string[] = [
      "allProducts",
      "category",
      "latest-products",
      `product-${productID}`,
    ];
    console.log("invalidateCache for products");
    myCache.del(productkeys);
  }
  if (order) {
    const orderKeys: string[] = [
      "all-orders",
      `my-order${userID}`,
      `order-details${orderID}`,
    ];

    productID?.forEach((i) => orderKeys.push(`product-${i}`));

    console.log("invalidateCache for orders");
    myCache.del(orderKeys);
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

/*
 let _data;

  if (myCache.has(My_Order_Key + `${userID}`)) {
    _data = JSON.parse(myCache.get(My_Order_Key + `${userID}`) as string);
  } else {
    _data = await Order.find({ user: userID });
    myCache.set(My_Order_Key + `${userID}`, _data);
  } */
