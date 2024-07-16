import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoDB_URL = process.env.MONGODB_URL;
const connectDB = async (req, res) => {
  try {
    const connection = await mongoose.connect(mongoDB_URL);
    console.log("DB Connected Successfully");
    return connection;
  } catch (err) {
    console.log("DB connection error", err);
  }
};

export default connectDB;
