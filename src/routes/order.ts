import express from "express";

import {
  handleAllOrders,
  handleDeleteOrder,
  handleGetOrderDetails,
  handleMyOrders,
  handleNewOrder,
  handleProcessOrder,
} from "../controllers/order.js";
import { AdminOnly } from "../middlewares/auth.js";

const orderRouter = express.Router();

/* 
New Order Json
{
    "shippingInfo": {
        "address": "sdjhfgj",
        "city": "Pune",
        "state": "MH",
        "country": "INDIA",
        "pincode": 345345
    },
    "user": "1",
    "subTotal": 5000,
    "tax": 200,
    "discount": 0,
    "shippingCharges": 50,
    "total": 5250,
    "status": "Processing",
    "orderItems": {
        "name": "Bespoke Wooden Shirt",
        "photo": "uploads/1c891d02-302c-4325-b3ce-9a8db0b0fa16.png",
        "price": 60863,
        "quantity": 1,
        "productID": "66bb96d0b027d4346ea2cb07"
    }
}*/

orderRouter.post("/new", handleNewOrder);

orderRouter.get("/my", handleMyOrders);

orderRouter.get("/all", AdminOnly, handleAllOrders);

orderRouter
  .route("/:id")
  .get(handleGetOrderDetails)
  .put(handleProcessOrder)
  .delete(handleDeleteOrder);

orderRouter
  .route("/:id")
  .get(handleGetOrderDetails)
  .put(AdminOnly, handleProcessOrder)
  .delete(AdminOnly, handleDeleteOrder);

export default orderRouter;
