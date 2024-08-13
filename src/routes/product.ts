import express from "express";
import {
  handleGetAllProducts,
  handleUpdateProduct,
  handleGetProduct,
  handleGetAdminProducts,
  handleGetCategories,
  handleGetLatestProducts,
  handleNewProduct,
  handleDeleteProduct,
} from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
import { AdminOnly } from "../middlewares/auth.js";

const productRouter = express.Router();

// ******/api/v1/product/new
productRouter.post("/new", AdminOnly, singleUpload, handleNewProduct);

// ******/api/v1/product/latest
productRouter.get("/latest", handleGetLatestProducts);

// ******/api/v1/product/categories
productRouter.get("/categories", handleGetCategories);

// ******/api/v1/product/admin-products
productRouter.get("/admin-products", handleGetAdminProducts);

// ******/api/v1/product/categories
productRouter.get("/all", handleGetAllProducts);

// ******/api/v1/product/:id (its a dynamic id)
productRouter
  .route("/:id")
  .get(handleGetProduct)
  .put(AdminOnly, singleUpload, handleUpdateProduct)
  .delete(AdminOnly, handleDeleteProduct);

export default productRouter;
