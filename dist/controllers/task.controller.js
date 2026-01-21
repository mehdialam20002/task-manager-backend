"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTask = exports.deleteTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const prisma_1 = require("../utils/prisma");
const createTask = async (req, res) => {
    const { title } = req.body;
    const userId = req.userId;
    if (!title)
        return res.status(400).json({ message: "Title required" });
    const task = await prisma_1.prisma.task.create({
        data: { title, userId },
    });
    res.status(201).json(task);
};
exports.createTask = createTask;
const getTasks = async (req, res) => {
    const userId = req.userId;
    const { page = "1", limit = "10", status, search } = req.query;
    const tasks = await prisma_1.prisma.task.findMany({
        where: {
            userId,
            status: status ? status === "true" : undefined,
            title: search ? { contains: String(search) } : undefined,
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
};
exports.getTasks = getTasks;
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const userId = req.userId;
    const task = await prisma_1.prisma.task.findUnique({ where: { id: +id } });
    if (!task || task.userId !== userId)
        return res.status(404).json({ message: "Task not found" });
    const updated = await prisma_1.prisma.task.update({
        where: { id: +id },
        data: { title },
    });
    res.json(updated);
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    const task = await prisma_1.prisma.task.findUnique({ where: { id: +id } });
    if (!task || task.userId !== userId)
        return res.status(404).json({ message: "Task not found" });
    await prisma_1.prisma.task.delete({ where: { id: +id } });
    res.json({ message: "Task deleted" });
};
exports.deleteTask = deleteTask;
const toggleTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    const task = await prisma_1.prisma.task.findUnique({ where: { id: +id } });
    if (!task || task.userId !== userId)
        return res.status(404).json({ message: "Task not found" });
    const updated = await prisma_1.prisma.task.update({
        where: { id: +id },
        data: { status: !task.status },
    });
    res.json(updated);
};
exports.toggleTask = toggleTask;
