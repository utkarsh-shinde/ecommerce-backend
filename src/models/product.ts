import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter product name"],
    },
    photo: {
      type: String,
      required: [true, "upload product photo"],
    },
    price: {
      type: Number,
      required: [true, "Enter product price"],
    },
    stock: {
      type: Number,
      required: [true, "Enter product stock"],
    },
    category: {
      type: String,
      required: [true, "Enter product category"],
      trim: true,
    },
    desc: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("products", productSchema);
