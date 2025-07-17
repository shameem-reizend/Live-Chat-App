import jwt from 'jsonwebtoken';
import { User } from '../models/UserModel';

export const generateAccessToken = (user: User) => {
  return jwt.sign(
    { id: user.id, name: user.name},
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (user: User) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );
};
