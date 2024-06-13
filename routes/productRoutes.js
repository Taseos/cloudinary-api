import express from "express";
import {
  createProduct,
  getProducts,
  deleteProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.post("/", createProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
