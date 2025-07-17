import express from 'express';
import { getAllUsers } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const userRoutes = express.Router();

userRoutes.get('/', authenticate, getAllUsers);

export default userRoutes;