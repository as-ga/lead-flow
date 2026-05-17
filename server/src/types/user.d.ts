export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "sales";
  refreshToken: string[];
  createdAt: Date;
  updatedAt: Date;
}
