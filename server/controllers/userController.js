import asyncHandler from "../middlewares/asyncHandler.js";
import UserModel from "../models/userModel.js";
import { createToken } from "../utils/tokenHandler.js";
import sendMail from "../utils/sendEmail.js";
import crypto from "crypto";

// @desc - Auth User & get token
// @route - POST /api/user/login
// @access - Public
const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    const verified = await user.comparePassword(password);
    if (verified) {
      const token = createToken(user._id);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
      });
    } else {
      res.status(401);
      throw new Error("Invalid password");
    }
  } else {
    res.status(404);
    throw new Error("Enter Correct Email");
  }
});

// @desc - Register User & get token
// @route - POST /api/user/register
// @access - Public
const createUser = asyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;
  const present = await UserModel.findOne({ email });
  if (present) {
    res.status(403);
    throw new Error("User Already Exist");
  } else {
    const user = await UserModel.create({ email, password, name });
    if (user) {
      const token = createToken(user._id);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
      });
    } else {
      res.status(400);
      throw new Error("Unable to register user");
    }
  }
});

// @desc - Forgot Password
// @route - POST /api/user/forgotpassword
// @access - Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    res.status(404);
    throw new Error("Email doesnt exist");
  }

  const { resetToken, resetPasswordToken, resetPasswordExpire } =
    user.generatePasswordReset();

  await UserModel.findByIdAndUpdate(
    user._id,
    {
      resetPasswordToken,
      resetPasswordExpire,
    },
    { runValidators: true, new: true }
  ).select("-password");

  sendMail({
    email: user.email,
    subject: "Reset Password Request |Store Notify",
   // message: `If you Requested Password Reset Kindly Follow up the link ${process.env.RESETURL}/resetpassword/${resetToken}`,
   message: `If you Requested Password Reset Kindly Follow up the link ${process.env.RESETURL}/`,
  })
    .then(() => {
      res.status(200).send(`Email Sent to ${user.email} Check your Inbox`);
    })
    .catch(() => {
      res.status(500);
      throw new Error("Coudnt sent email");
    });
});

// @desc - Reset Password
// @route - PUT /api/user/resetpassword/
// @access - Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get Hashed Token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.body.resetToken)
    .digest("hex");

  const user = await UserModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Link Expired try again");
  }

  // Set the new Password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = createToken(user._id);
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token,
  });
});

// @desc - User profile
// @route - GET /api/user/profile
// @access - Private
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);
  if (user) {
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  }

  res.status(404);
  throw new Error("User Not Found");
});

// @desc - Update User profile
// @route - PUT /api/user/profile
// @access - Private
const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: createToken(updatedUser._id),
    });
  }
  res.status(404);
  throw new Error("User Not Found");
});

// Admin Routes

// @desc - Get all users
// @route - GET /api/users
// @access - Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find();
  if (users) {
    return res.status(200).json(users);
  }
  res.status(404);
  throw new Error("No Users Present");
});

// @desc - GET user by Id
// @route -  GET /api/user/users/:id
// @access - Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findById(id).select("-password");
  if (user) {
    return res.status(200).json(user);
  }
  res.status(404);
  throw new Error("User Not Found");
});

// @desc - update user by Id
// @route - PUT /api/user/users/:id
// @access - Private/Admin
const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  }
  res.status(404);
  throw new Error("User Not Found");
});

// @desc - DELETE a user
// @route - DELETE /api/users/:id
// @access - Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await UserModel.findByIdAndDelete(id);
  res.json({
    message: "User Removed",
  });
});

export {
  authUser,
  getUserProfile,
  createUser,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
};
