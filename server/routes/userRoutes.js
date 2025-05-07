import express from "express";
import {
  authUser,
  createUser,
  deleteUser,
  forgotPassword,
  getAllUsers,
  getUserById,
  getUserProfile,
  resetPassword,
  updateUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { verifyUser } from "../middlewares/protectRoute.js";
import roles from "../middlewares/roles.js";

const userRouter = express.Router();

userRouter.route("/login").post(authUser);
userRouter.route("/register").post(createUser);
userRouter.route("/forgotpassword").post(forgotPassword);
userRouter.route("/resetpassword").put(resetPassword);

// Admin Routes
userRouter.route("/users").get(verifyUser, roles, getAllUsers);
userRouter
  .route("/users/:id")
  .delete(verifyUser, roles, deleteUser)
  .get(verifyUser, roles, getUserById)
  .put(verifyUser, roles, updateUser);

userRouter
  .route("/profile")
  .get(verifyUser, getUserProfile)
  .put(verifyUser, updateUserProfile);

export default userRouter;
