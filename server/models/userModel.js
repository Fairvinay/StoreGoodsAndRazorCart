import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generatePasswordReset = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  let resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  let resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return { resetToken, resetPasswordToken, resetPasswordExpire };
};

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const UserModel = mongoose.model("usergadget360", UserSchema);

export default UserModel;
