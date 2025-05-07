import jwt from "jsonwebtoken";

const day = 60 * 60;

const createToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: day });
};

export { createToken };
