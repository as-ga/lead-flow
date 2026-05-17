import { Types } from "mongoose";
export interface IUser extends Document {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "admin" | "sales";
  refreshToken: string[];
  createdAt: Date;
  updatedAt: Date;
}
