import express from "express";
import { handleNewProduct } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";

const productRouter = express.Router();

// /api/v1/product/new
productRouter.post("/new", singleUpload, handleNewProduct);

export default productRouter;
