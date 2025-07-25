import express from 'express';
import { getCurrentUser, googleAuth, login, logout, refreshToken, register } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/refresh-token', refreshToken);
authRoutes.get('/logout', logout);
authRoutes.get('/me', authenticate, getCurrentUser);
authRoutes.post('/google', googleAuth);

export default authRoutes;