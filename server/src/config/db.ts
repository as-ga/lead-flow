import mongoose from "mongoose";
import env from "./env";

const connectDB = async () => {
  try {
    //   ci stands for connection instance
    const ci = await mongoose.connect(env.mongodbURI);
    console.log(`\n MongoDB connected Successfully : ${ci.connection.name}`);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
