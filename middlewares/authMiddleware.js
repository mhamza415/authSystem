import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { errorHandler } from "./errorMiddleware.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        res.status(401);
        throw new Error("You are unauthorized to make this request");
      }

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Invalid token"); // Handle the case of invalid token
    }
  } else {
    res.status(401);
    throw new Error("No token found"); // Handle the case of missing token
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    console.log(req.user.isAdmin);
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as Admin");
  }
};

const canAdd = (req, res, next) => {
  // Check if the user has the required permission
  if (req.user.permissions.includes("add")) {
    next(); // User has the required permission, proceed to the next middleware
  } else {
    res.status(403).send("Insufficient permissions"); // User does not have the required permission, send a 403 Forbidden response
  }
};

const canUpdate = (req, res, next) => {
  // Check if the user has the required permission
  if (req.user.permissions.includes("add")) {
    next(); // User has the required permission, proceed to the next middleware
  } else {
    res.status(403).send("Insufficient permissions"); // User does not have the required permission, send a 403 Forbidden response
  }
};
const canDelete = (req, res, next) => {
  // Check if the user has the required permission
  if (req.user.permissions.includes("delete")) {
    next(); // User has the required permission, proceed to the next middleware
  } else {
    res.status(403).send("Insufficient permissions"); // User does not have the required permission, send a 403 Forbidden response
  }
};
const canView = (req, res, next) => {
  try {
    // Check if the user has the required permission
    if (req.user.permissions.includes("view")) {
      next(); // User has the required permission, proceed to the next middleware
    } else {
      res.status(403).send("Insufficient permissions"); // User does not have the required permission, send a 403 Forbidden response
      throw new Error("You have not permission to view");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export { protect, admin, canAdd, canUpdate, canView, canDelete };
