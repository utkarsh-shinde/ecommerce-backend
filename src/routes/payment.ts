import express from "express";
import {
  handleDeleteCoupon,
  handleGetAllCoupons,
  handleApplyDiscount,
  handleCreateNewCoupon,
} from "../controllers/payment.js";

const paymentRouter = express.Router();

// /api/v1/payment/coupon/new
paymentRouter.post("/coupon/new", handleCreateNewCoupon);

// /api/v1/payment/discount
paymentRouter.get("/discount", handleApplyDiscount);

// /api/v1/payment/coupon/all
paymentRouter.get("/coupon/all", handleGetAllCoupons);

// /api/v1/payment/coupon/delete
paymentRouter.delete("/coupon/delete/:id", handleDeleteCoupon);

export default paymentRouter;
