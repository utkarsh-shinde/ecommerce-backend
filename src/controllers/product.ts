import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";

import { NewProductRequest } from "../types/types.js";
import { Product } from "../models/product.js";

export const handleNewProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequest>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, price, stock, category, desc } = req.body;
    console.log("request body :: " + req.body.name);
    const _photoPath = req.file;

    let _product = await Product.create({
      name,
      price,
      stock,
      category: category?.toLowerCase(),
      desc,
      photo: _photoPath?.path,
    });

    return res.status(200).json({ success: true, _product });
  }
);
