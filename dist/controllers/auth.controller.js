"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../utils/prisma");
const jwt_1 = require("../utils/jwt");
const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ message: "All fields required" });
    const exists = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (exists)
        return res.status(400).json({ message: "Email already exists" });
    const hashed = await bcrypt_1.default.hash(password, 10);
    await prisma_1.prisma.user.create({
        data: { name, email, password: hashed },
    });
    res.status(201).json({ message: "User registered successfully" });
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ message: "Invalid credentials" });
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!match)
        return res.status(401).json({ message: "Invalid credentials" });
    const accessToken = (0, jwt_1.generateAccessToken)(user.id);
    const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });
    res.json({ accessToken, refreshToken });
};
exports.login = login;
const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.status(401).json({ message: "No refresh token" });
    const user = await prisma_1.prisma.user.findFirst({
        where: { refreshToken },
    });
    if (!user)
        return res.status(401).json({ message: "Invalid refresh token" });
    const accessToken = (0, jwt_1.generateAccessToken)(user.id);
    res.json({ accessToken });
};
exports.refresh = refresh;
const logout = async (req, res) => {
    const { refreshToken } = req.body;
    await prisma_1.prisma.user.updateMany({
        where: { refreshToken },
        data: { refreshToken: null },
    });
    res.json({ message: "Logged out" });
};
exports.logout = logout;
