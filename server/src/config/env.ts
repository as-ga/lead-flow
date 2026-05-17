import dotenv from "dotenv";
dotenv.config();

const _env = {
  port: Number(process.env.PORT) || 5000,
  isDev: process.env.NODE_ENV?.toLocaleLowerCase() === "development",
  clientURL: process.env.CLIENT_URL!,

  //  Database
  mongodbURI: process.env.MONGODB_URI!,

  // JWT related
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpires: Number(process.env.JWT_EXPIRE) || 1 * 24 * 60 * 60, // default to 1 days in seconds
};

const env = Object.freeze(_env);
export default env;
