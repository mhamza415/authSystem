import express from "express";
import {
  authUser,
  registerUser,
  createAdminUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from "../controllers/userController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import {
  addIpAddress,
  updateIpAddress,
  deleteIpAddress,
  getIpAddress,
} from "../controllers/userIpController.js";
import { attendanceOut } from "../controllers/attendanceController.js";

const router = express.Router();

// @desc    create admin user
// route    http://localhost/8000/user/admin
let adminCreated = false;
router.route("/admin").post((req, res, next) => {
  try {
    if (adminCreated) {
      res.status(401);
      throw new Error("You are Unauthorized to create admin!");
    } else {
      createAdminUser(req, res, next);
      adminCreated = true;
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Register a user
// @route   http://localhost/8000/user/register
// @access  Public

router.route("/register").post(protect, admin, registerUser);

// @desc    login a user and admin
// @route    http://localhost/8000/user/login
// @access  Public

router.route("/login").post(authUser);

// @desc    login a user and admin
// @route    http://localhost/8000/user/logout
// @access  Protected
router.route("/logout").post(protect, attendanceOut);

// @desc    get user Profile
// @route    http://localhost/8000/user/login
// @access  Protected
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserProfile);

// @desc     User's Ip address while
// route    /user/ip
// access    protected
router.route("/ip").post(protect, addIpAddress);
router
  .route("/ip/:id")
  .put(protect, updateIpAddress)
  .delete(protect, deleteIpAddress)
  .get(protect, getIpAddress);

export default router;
