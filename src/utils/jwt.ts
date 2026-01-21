import jwt, { Secret, SignOptions } from "jsonwebtoken";

const ACCESS_SECRET: Secret = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET!;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT secrets missing in environment variables");
}

export const generateAccessToken = (userId: number): string => {
  return jwt.sign(
    { userId },
    ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
    }
  );
};

export const generateRefreshToken = (userId: number): string => {
  return jwt.sign(
    { userId },
    REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
    }
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};
