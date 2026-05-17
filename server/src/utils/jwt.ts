import jwt from "jsonwebtoken";
import env from "@/config/env";
import { Types } from "mongoose";

interface JwtPayload {
  _id: Types.ObjectId;
  role: "admin" | "sales";
  iat?: number;
}

const { jwtSecret, jwtExpires } = env;

function signAccessToken(payload: JwtPayload): string {
  if (payload.iat === undefined)
    payload.iat = Math.floor(Date.now() / 1000) - 30;

  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpires,
  }) as string;
}

function signRefreshToken(payload: JwtPayload): string {
  if (payload.iat === undefined)
    payload.iat = Math.floor(Date.now() / 1000) - 30;

  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpires + 7 * 24 * 60 * 60, // refresh token valid for 7 days more than access token
  }) as string;
}

function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, jwtSecret) as JwtPayload;
  } catch (e) {
    return null;
  }
}

export { signAccessToken, signRefreshToken, verifyToken };
