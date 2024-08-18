import mongoose from "mongoose";

const couponScehema = new mongoose.Schema(
  {
    coupon: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model("coupons", couponScehema);
