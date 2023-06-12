import express from "express";

import { protect, admin } from "../middlewares/authMiddleware.js";
const router = express.Router();
import {
  getUserProfile,
  deleteUserProfile,
} from "../controllers/userController.js";
import {
  updateUserProfile,
  registerUser,
} from "../controllers/usersControllers.js";

// @desc    admin can create a new admin
// route    http://localhost/8000/users/createadmin

router.route("/createadmin").post(protect, admin, registerUser);

// @desc    admin can get data of any user can delete update
// route    http://localhost/8000/users/profile

router
  .route("/profile")
  .get(protect, admin, getUserProfile)
  .put(protect, admin, updateUserProfile)
  .delete(protect, admin, deleteUserProfile);

export default router;
