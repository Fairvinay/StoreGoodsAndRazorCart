import express from "express";

import {
  updateProduct,
  createProduct,
  deleteProduct,
  getProductDetail,
  getProducts,
  reviewProduct,
  getTopRatedProd,
  getFilteredProducts,
} from "../controllers/productController.js";
import { verifyUser } from "../middlewares/protectRoute.js";
import roles from "../middlewares/roles.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(getProducts)
  .post(verifyUser, roles, createProduct);

productRouter.get("/toprated", getTopRatedProd);
productRouter.get("/filter", getFilteredProducts);
productRouter
  .route("/:id")
  .get(getProductDetail)
  .delete(verifyUser, roles, deleteProduct)
  .put(verifyUser, roles, updateProduct);

productRouter.route("/:id/review").post(verifyUser, reviewProduct);
export default productRouter;
