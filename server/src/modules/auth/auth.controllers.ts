import { CookieOptions } from "express";
import type { Request, Response } from "express";
import { ApiError, ApiResponse } from "@/utils/apiHandler";
import { asyncHandler } from "@/utils/asyncHandler";
import { User } from "@/models/user";
import { registerUserSchema, loginUserSchema } from "./auth.validations";
import * as jwt from "@/utils/jwt";
import env from "@/config/env";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: !env.isDev,
  sameSite: "strict",
  domain: env.isDev ? "localhost" : env.clientURL.replace(/^https?:\/\//, ""),
  maxAge: env.jwtExpires + 10 * 24 * 60 * 60, // set cookie expiry slightly longer than refresh token expiry
};
const expiredCookieOptions: CookieOptions = { ...cookieOptions, maxAge: 0 };

const registerUser = asyncHandler(async (req, res) => {
  // write a steps to register a user
  // 1. validate input
  // 2. check if user already exists or not
  // 3. create user
  // 4. return response

  const payload = registerUserSchema.parse(req.body);

  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) throw new ApiError(409, "User with email already exists");

  const newUser = await User.create(payload);

  if (!newUser)
    throw new ApiError(500, "Something went wrong while registering the user");

  return res.status(201).json(
    new ApiResponse(200, "User registered Successfully", {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    })
  );
});

const loginUser = asyncHandler(async (req, res) => {
  // write a steps to login a user
  // 1. validate input
  // 2. check if user exists or not
  // 3. compare password
  // 4. create session and tokens
  // 5. return response

  const payload = loginUserSchema.parse(req.body);

  const user = await User.findOne({
    email: payload.email,
  }).select("+password");

  if (!user) throw new ApiError(404, "User with this email does not exist");

  const isPasswordCorrect = await user.isPasswordCorrect(payload.password);

  if (!isPasswordCorrect) throw new ApiError(401, "Invalid credentials");

  const jwtPayload = { _id: user._id, role: user.role };
  const accessToken = await jwt.signAccessToken(jwtPayload);
  const refreshToken = await jwt.signRefreshToken(jwtPayload);

  await User.findByIdAndUpdate(
    user._id,
    { $push: { refreshToken } },
    { new: true }
  );

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    );
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  // write a steps to logout a user
  // 1. get refresh token from cookies or authorization header
  // 2. verify token and get payload
  // 3. remove refresh token from database
  // 4. clear cookies and return response

  const refreshToken =
    req.headers["refreshToken"] ||
    req.body?.refreshToken ||
    req.cookies?.refreshToken;

  if (refreshToken) {
    const payload = jwt.verifyToken(refreshToken);

    if (payload)
      await User.findByIdAndUpdate(
        payload._id,
        { $pull: { refreshToken } },
        { new: true }
      );
  }
  return res
    .status(200)
    .cookie("refreshToken", "", expiredCookieOptions)
    .cookie("accessToken", "", expiredCookieOptions)
    .json(new ApiResponse(200, "User logged out successfully"));
});

const logoutAllSessions = asyncHandler(async (req, res) => {
  // write a steps to logout user from all sessions
  // 1. get user id from request (set by auth middleware)
  // 2. remove all refresh tokens from database for that user
  // 3. clear cookies and return response

  const userId = req?.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  await User.findByIdAndUpdate(userId, { refreshToken: [] }, { new: true });
  return res
    .status(200)
    .cookie("refreshToken", "", expiredCookieOptions)
    .cookie("accessToken", "", expiredCookieOptions)
    .json(
      new ApiResponse(200, "User logged out from all sessions successfully")
    );
});

const refreshToken = asyncHandler(async (req, res) => {
  // write a steps to refresh access token
  // 1. get refresh token from cookies or authorization header
  // 2. verify token and get payload
  // 3. check if refresh token is valid or not by comparing with database
  // 4. if valid then create new access token and refresh token
  // 5. save new refresh token in database and remove old refresh token from database
  // 6. return response with new tokens

  const oldRefreshToken =
    req.cookies?.refreshToken ||
    req.headers["refreshToken"] ||
    req.body?.refreshToken;
  if (!oldRefreshToken) throw new ApiError(401, "Unauthorized");

  const payload = jwt.verifyToken(oldRefreshToken);
  if (!payload) throw new ApiError(401, "Unauthorized");

  const user = await User.findById(payload._id);
  if (!user) throw new ApiError(404, "User not found");

  const isRefreshTokenValid = user.refreshToken.includes(oldRefreshToken);
  if (!isRefreshTokenValid) throw new ApiError(401, "Unauthorized");

  const jwtPayload = { _id: user._id, role: user.role };
  const newAccessToken = await jwt.signAccessToken(jwtPayload);
  const newRefreshToken = await jwt.signRefreshToken(jwtPayload);

  await User.findByIdAndUpdate(
    user._id,
    {
      refreshToken: [
        ...user.refreshToken.filter((t) => t !== oldRefreshToken),
        newRefreshToken,
      ],
    },
    { new: true }
  );

  return res
    .status(200)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .cookie("accessToken", newAccessToken, cookieOptions)
    .json(
      new ApiResponse(200, "Token refreshed successfully", {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      })
    );
});

export { registerUser, loginUser, logoutUser, logoutAllSessions, refreshToken };
