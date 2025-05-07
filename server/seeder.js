import mongoose from "mongoose";
import db from "./config/db.js";
import dotenv from "dotenv";
import colors from "colors";
import fs from "fs";
import path from "path";
import products from "./_data/products.js";
import users from "./_data/users.js";
import ProductModel from "./models/productModel.js";
import UserModel from "./models/userModel.js";
import OrderModel from "./models/orderModel.js";

dotenv.config();

const uploadData = async () => {
  await db();
  await ProductModel.deleteMany();
  await UserModel.deleteMany();
  await OrderModel.deleteMany();

  await UserModel.create(users);
  const admin = await UserModel.findOne({ isAdmin: true });
  const productList = products.map(product => {
    return { ...product, user: admin._id };
  });

  await ProductModel.create(productList);
  console.log("data uploaded".america.bold);
};

const deleteData = async () => {
  await ProductModel.deleteMany();
  await UserModel.deleteMany();
  await OrderModel.deleteMany();
  console.log("data destroyed".america.bold);
};

if (process.argv[2] === "-i") {
  uploadData();
  //   process.exit(0);
} else if (process.argv[2] === "-d") {
  deleteData();
  //   process.exit(0);
}
