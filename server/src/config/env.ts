import dotenv from "dotenv";
dotenv.config();

const _env = {
  port: Number(process.env.PORT) || 5000,
  mongodbURI: process.env.MONGODB_URI!,
};

const env = Object.freeze(_env);
export default env;
