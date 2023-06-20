import User from "../models/userModel.js";
import generateToken from "../utills/generateToken.js";
import { attendanceRegister } from "./attendanceController.js";

// @desc    Register a admin user
// @access  Public
const createAdminUser = async (req, res, next) => {
  try {
    // @desc    check if admin exists or not
    const adminUserExists = await User.findOne({ isAdmin: true });
    if (adminUserExists) {
      res.status(400);
      throw new Error("Admin user already exists");
    }

    // @desc  create a new admin
    const adminUser = await User.create({
      name: "admin",
      email: "admin@proshop.com",
      password: "1234",
      permissions: ["add", "update", "delete", "view"],
      isAdmin: true,
    });
    if (adminUser) {
      res.status(201).json({
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        isAdmin: adminUser.isAdmin,
        Token: generateToken(adminUser._id),
      });
    } else {
      res.status(500);
      throw new Error("Failed to create admin");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @access  Public

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, permissions } = req.body;
    //   @DESC      input validation
    if (!(name && email && password)) {
      res.status(400).send("All the inputs are required");
    }

    //   @DESC      check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("user already exists...");
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role,
      permissions,
    });
    if (newUser) {
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        permissions: newUser.permissions,
        isAdmin: newUser.isAdmin,
        Token: generateToken(newUser._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @access  Public

const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // @desc    validate the user must send email and password
    if (!(email && password)) {
      res.status(400).send("email and password are required");
    }
    if (!req.session.userSessionId) {
      // @desc    check the account details are available
      const userExists = await User.findOne({ email });

      if (userExists && (await userExists.matchPassword(password))) {
        const attendanceData = await attendanceRegister(userExists._id, req.ip);
        let startTime;
        let location;
        const locationIndex = attendanceData.locations.findIndex(
          (location) => location.endTime === null
        );

        if (locationIndex !== -1) {
          startTime = attendanceData.locations[locationIndex].startTime;
          location = attendanceData.locations[locationIndex].locationName;
          // Use the startTime value as needed
        } else {
          // Handle the case when no location object with endTime null is found
        }
        // Start the session by storing the user ID in the session object
        req.session.userSessionId = userExists._id;

        res.status(200).json({
          _id: userExists._id,
          name: userExists.name,
          email: userExists.email,
          isAdmin: userExists.isAdmin,
          Token: generateToken(userExists._id),
          yourIp: attendanceData.ip,
          yourLocation: location,
          startTime: startTime,
        });
      } else {
        res.status(401);
        throw new Error("invalid credentials");
      }
    } else {
      res.json("you are already logged in");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile details
// @access  Protected

const getUserProfile = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  try {
    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User Not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    update user profile details
// @access  Protected
// @method  Put

const updateUserProfile = async (req, res, next) => {
  try {
    const { name, email, password, role, permissions } = req.body;
    // checking email should be unique must not in db

    const existsEmail = await User.findOne({ email });
    if (existsEmail) {
      res.status(400);
      throw new Error("email already exists");
    }

    const user = await User.findById(req.user._id);
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.password = password || user.password;
      user.role = role || user.role;
      user.permissions = permissions || user.permissions;

      const updatedUser = await user.save();
      res.status(201).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        permissions: updatedUser.permissions,
        isAdmin: updatedUser.isAdmin,
        Token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error("user not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    update user profile details
// @access  Protected
const deleteUserProfile = async (req, res, next) => {
  try {
    // check if the requesting user exists or have been deleted
    // if req.user does not exist throwing error
    if (!req.user) {
      res.status(401);
      throw new Error(
        "Unauthorized: User not recognized or have been deleted "
      );
    }

    const user = await User.findById(req.user._id);
    if (user) {
      await User.deleteOne({ _id: user._id });
      res.status(200).json({ message: "user removed" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};
export {
  registerUser,
  authUser,
  createAdminUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
