import mongoose from "mongoose";

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    serverSelectionTimeoutMS: 30000, // <-- increase this from default 10s
  });

  console.log(`Connected to Database ${conn.connection.host}`);
};

export default connectDB;
