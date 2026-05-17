import { Request } from "express";
import { verifyToken } from "@/utils/jwt";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiError } from "@/utils/apiHandler";
import { User, UserType } from "@/models/user";

declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}

async function getUserFromRequest(req: Request): Promise<UserType | null> {
  // write step to get token from cookies or authorization header
  // 1.get token from cookies or authorization header
  // 2.verify token and get payload
  // 3.get user from database using payload._id and return user

  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) throw new ApiError(401, "Access token is required");

  const payload = await verifyToken(token);
  if (!payload) throw new ApiError(401, "Invalid or expired access token");

  return await User.findById(payload._id).select("-password, -refreshToken");
}

const isAuthenticated = asyncHandler(async (req, _, next) => {
  const user = await getUserFromRequest(req);
  if (!user) throw new ApiError(401, "Unauthorized");
  req.user = user;
  next();
});

const isAdmin = asyncHandler(async (req, _, next) => {
  const user = await getUserFromRequest(req);
  if (user?.role !== "admin")
    throw new ApiError(403, "Only admins can access this resource");
  req.user = user;
  next();
});

export { isAuthenticated, isAdmin };
