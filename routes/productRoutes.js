import express from "express";
const router = express.Router();

import {
  getProductById,
  getProducts,
  deleteProduct,
  updateProduct,
  createProduct,
} from "../controllers/productControllers.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import {
  canAdd,
  canDelete,
  canUpdate,
  canView,
} from "../middlewares/authMiddleware.js";

// route  http://localhost/8000/product/get

router.route("/get").get(protect, canView, getProducts);
// router.route("/get").get(protect, getProducts);

// @desc    create a product
// @route   http://localhost/8000/product/create
// @access  protected admin
router.route("/create").post(protect, admin || canAdd, createProduct);

router
  .route("/:id")
  .get(protect, canView, getProductById)
  .delete(protect, admin || canDelete, deleteProduct)
  .put(protect, admin || canUpdate, updateProduct);

export default router;
