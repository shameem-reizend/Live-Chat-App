import { AppDataSource } from "../config/data-source";
import { User } from "../models/UserModel";

export const setUserOnline = async (userId: string) => {
  const userRepo = AppDataSource.getRepository(User);

  await userRepo.update(userId, {
    isOnline: true,
  });

  console.log(`User ${userId} is now ONLINE`);
};

export const setUserOffline = async (userId: string) => {
  const userRepo = AppDataSource.getRepository(User);

  await userRepo.update(userId, {
    isOnline: false,
    lastSeen: new Date(),
  });

  console.log(`User ${userId} is now OFFLINE`);
};
