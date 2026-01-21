import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const createTask = async (req: Request, res: Response) => {
  const { title } = req.body;
  const userId = (req as any).userId;

  if (!title)
    return res.status(400).json({ message: "Title required" });

  const task = await prisma.task.create({
    data: { title, userId },
  });

  res.status(201).json(task);
};

export const getTasks = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { page = "1", limit = "10", status, search } = req.query;

  const tasks = await prisma.task.findMany({
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

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;
  const userId = (req as any).userId;

  const task = await prisma.task.findUnique({ where: { id: +id } });
  if (!task || task.userId !== userId)
    return res.status(404).json({ message: "Task not found" });

  const updated = await prisma.task.update({
    where: { id: +id },
    data: { title },
  });

  res.json(updated);
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).userId;

  const task = await prisma.task.findUnique({ where: { id: +id } });
  if (!task || task.userId !== userId)
    return res.status(404).json({ message: "Task not found" });

  await prisma.task.delete({ where: { id: +id } });
  res.json({ message: "Task deleted" });
};

export const toggleTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).userId;

  const task = await prisma.task.findUnique({ where: { id: +id } });
  if (!task || task.userId !== userId)
    return res.status(404).json({ message: "Task not found" });

  const updated = await prisma.task.update({
    where: { id: +id },
    data: { status: !task.status },
  });

  res.json(updated);
};
