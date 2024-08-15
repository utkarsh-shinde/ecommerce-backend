import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/orders.js";
import { reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";

export const handleNewOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      user,
      subTotal,
      tax,
      discount,
      shippingCharges,
      total,
      status,
      orderItems,
    } = req.body;

    if (
      !shippingInfo ||
      !user ||
      !subTotal ||
      !tax ||
      !discount ||
      !shippingCharges ||
      !total ||
      !status ||
      !orderItems
    )
      return next(new ErrorHandler("Please enter all the order details", 401));

    const order = await Order.create({
      shippingInfo,
      user,
      subTotal,
      tax,
      discount,
      shippingCharges,
      total,
      status,
      orderItems,
    });

    reduceStock(orderItems);

    return res
      .status(201)
      .json({ success: true, message: "Order created successfully" });
  }
);
