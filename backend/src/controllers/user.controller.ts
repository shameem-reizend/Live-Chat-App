import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/UserModel";
import { AppError } from "../utils/AppError";
import { Not } from "typeorm";

export const getAllUsers = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  const userRepo = AppDataSource.getRepository(User);
  const userId = req.user.id;

  try {

    const users = await userRepo.find({
      select: ['id', 'name', 'email', 'isOnline', 'lastSeen'],
      where: {
        id: Not(userId),
      },
      order: {
        name: 'ASC',
      },
    });


    res.status(200).json(users);
  } catch (error) {
    next(new AppError('Server Error', 500));
  }
}