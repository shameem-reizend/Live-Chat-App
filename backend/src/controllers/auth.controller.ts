import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../models/UserModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/jwt';
import { AppError } from '../utils/AppError';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

interface authenticateRequest extends Request {
      user?: {
        id: number;
        name?: string;
        email?: string;
        password: string;
      };
}

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userRepo = AppDataSource.getRepository(User);
  const { name, email, password } = req.body;
  console.log(name, email, password)

  try {
    const existing = await userRepo.findOne({ where: { email } });
    if (existing) {
      next(new AppError('Email already in use', 409))
      return 
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = userRepo.create({ name, email, password: hashed });
    await userRepo.save(user);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(new AppError('Server Error', 500))
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userRepo = AppDataSource.getRepository(User);
  const { email, password } = req.body;

  try {
    const user = await userRepo.findOne({ where: { email } });
    if (!user){
      next(new AppError('User Not Found', 404))
      return
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
       next(new AppError('Invalid Credentials', 401))
       return
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'Login successful', accessToken, user });
  } catch (err) {
    next(new AppError('Server Error', 500))
  }
};

export const refreshToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.refreshToken;
  if (!token){
    next(new AppError('No refresh token', 401))
    return
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: number };
    const newAccessToken = jwt.sign(
      { id: payload.id },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(new AppError('Invalid refresh token', 403))
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};


export const getCurrentUser = async (req: authenticateRequest, res: Response, next: NextFunction): Promise<void> => {
  const userRepo = AppDataSource.getRepository(User);
  const userId = req.user?.id; 

  if (!userId){
    next(new AppError('unauthorized', 401))
    return
  }

  try {
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user){
      next(new AppError('User Not Found', 404));
      return
    }

    res.json(user);
  } catch (err) {
    next(new AppError('Server error', 500));
  }
};


// Initialize Google OAuth client
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage' // For server-side flow
);

export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const { code } = req.body;
    const { tokens } = await googleClient.getToken(code);

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid token payload');
    }

    const { email, name, family_name } = payload;

    let user = await userRepo.findOne({ where: { email } }); 

    if (!user) {
      const hashed = await bcrypt.hash(`${family_name}@123`, 10);
      user = userRepo.create({
        email,
        name,
        password: hashed
      });
      await userRepo.save(user);

      const userDetails = await userRepo.findOne({ where: { email } });

      if (userDetails) {
        const accessToken = generateAccessToken(userDetails);
        console.log("accessToken - ", accessToken);
        res.json({ accessToken, user: userDetails });
      }
    } else {
      const accessToken = generateAccessToken(user);
      res.json({ accessToken, user });
    }
    
  } catch (error) {
    // console.error('Google auth error:', error);
    next(new AppError('Google authentication failed', 500));
  }
};