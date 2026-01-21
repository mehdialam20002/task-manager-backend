import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists)
    return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, password: hashed },
  });

  res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  res.json({ accessToken, refreshToken });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  const user = await prisma.user.findFirst({
    where: { refreshToken },
  });

  if (!user)
    return res.status(401).json({ message: "Invalid refresh token" });

  const accessToken = generateAccessToken(user.id);
  res.json({ accessToken });
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  await prisma.user.updateMany({
    where: { refreshToken },
    data: { refreshToken: null },
  });

  res.json({ message: "Logged out" });
};
