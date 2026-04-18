import mongoose from "mongoose";
import { config } from "./config.js";
export const connectDB = async () => {
  try {
    mongoose.connect(config.MONGO_URI);
    console.log("connected");
  } catch (error) {
    return console.log(error.message);
  }
};
