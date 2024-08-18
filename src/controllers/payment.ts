import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";

export const handleCreateNewCoupon = TryCatch(async (req, res, next) => {
  const { coupon, amount } = req.body;

  if (!coupon || !amount)
    return next(new ErrorHandler("Please add coupon code / amount", 400));

  const _coupon = await Coupon.create({
    coupon,
    amount,
  });

  res.status(201).json({
    success: true,
    message: "Coupon created successfully",
  });
});

export const handleApplyDiscount = TryCatch(async (req, res, next) => {
  const { coupon } = req.query;

  if (!coupon) return next(new ErrorHandler("Please enter discount code", 400));

  const discount = await Coupon.findOne({ coupon });

  if (!discount) return next(new ErrorHandler("Invalid discount code", 400));

  res.status(200).json({ success: true, amount: discount.amount });
});

export const handleGetAllCoupons = TryCatch(async (req, res, next) => {
  const coupons = await Coupon.find({});

  if (!coupons) return next(new ErrorHandler("No coupons found", 400));

  res.status(200).json({ success: true, coupons });
});

export const handleDeleteCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  if (!id) return next(new ErrorHandler("Please enter coupon code", 400));

  const _coupon = await Coupon.findOne({ coupon: id });

  await _coupon?.deleteOne();

  res.status(200).json({
    success: true,
    message: `Coupon with code ${id} deleted successfully`,
  });
});
