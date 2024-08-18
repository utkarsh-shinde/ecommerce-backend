import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/orders.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";
import { invalidateCache, reduceStock } from "../utils/features.js";

// Cache Keys
const My_Order_Key = "my-order";
const All_Order_Key = "all-orders";
const Order_Detail_Key = "order-details";

export const handleNewOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    console.log("request body ::::::: " + req.body);
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

    await invalidateCache({
      product: true,
      order: true,
      userID: order.user,
      orderID: String(order.id),
      productID: order.orderItems.map((i) => i.id),
    });

    return res
      .status(201)
      .json({ success: true, message: "Order created successfully" });
  }
);

export const handleMyOrders = TryCatch(async (req, res, next) => {
  const { id: userID } = req.query;

  let _data;

  if (myCache.has(My_Order_Key + `${userID}`)) {
    _data = JSON.parse(myCache.get(My_Order_Key + `${userID}`) as string);
  } else {
    _data = await Order.find({ user: userID });
    myCache.set(My_Order_Key + `${userID}`, JSON.stringify(_data));
  }

  return res.status(200).json({ success: true, orders: _data });
});

export const handleAllOrders = TryCatch(async (req, res, next) => {
  let _data;

  if (myCache.has(All_Order_Key)) {
    _data = JSON.parse(myCache.get(All_Order_Key) as string);
  } else {
    _data = await Order.find({}).populate("user", "name email");
    myCache.set(All_Order_Key, JSON.stringify(_data));
  }

  return res.status(200).json({ success: true, orders: _data });
});

export const handleGetOrderDetails = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  let _data;

  if (myCache.has(Order_Detail_Key + `${id}`)) {
    _data = JSON.parse(myCache.get(Order_Detail_Key + `${id}`) as string);
  } else {
    _data = await Order.findById(id).populate("user", "name email");
    myCache.set(Order_Detail_Key + `${id}`, JSON.stringify(_data));
  }

  return res.status(200).json({
    success: true,
    orderDetails: _data === null ? "No Order found" : _data,
  });
});

export const handleProcessOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const _order = await Order.findById(id);

  if (!_order) return next(new ErrorHandler("No Order found", 404));

  switch (_order?.status) {
    case "Processing":
      _order.status = "Shipped";
      break;
    case "Shipped":
      _order.status = "Delivered";
      break;
    default:
      _order.status = "Delivered";
      break;
  }
  _order.save();
  await invalidateCache({
    order: true,
    userID: _order.user,
    orderID: String(id),
  });
  return res
    .status(200)
    .json({ success: true, message: "Order Processed successfully" });
});

export const handleDeleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const _order = await Order.findById(id);

  if (!_order) return next(new ErrorHandler("No order found", 404));

  await _order.deleteOne();

  await invalidateCache({
    order: true,
    userID: _order.user,
    orderID: String(id),
  });

  return res
    .status(200)
    .json({ success: true, message: "Order Deleted successfully" });
});
