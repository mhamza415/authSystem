import User from "../models/userModel.js";
import generateToken from "../utills/generateToken.js";

// @desc    Register a new user
// @access  protected Only admin

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, permissions, isAdmin } = req.body;
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
      isAdmin,
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

// @desc    update user profile details
// @access  Protected admin only
// @method  Put

const updateUserProfile = async (req, res, next) => {
  try {
    const { name, email, password, role, permissions, isAdmin } = req.body;
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
      user.isAdmin = isAdmin || user.isAdmin;
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

export { updateUserProfile, registerUser };
