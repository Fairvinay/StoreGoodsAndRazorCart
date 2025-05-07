import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const verifyUser = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    try {
      token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await UserModel.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      console.error(err);
      res.status(401);
      throw new Error("Not Authorized token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not Authorized, no token");
  }
});

export { verifyUser };
