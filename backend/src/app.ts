import express from 'express';
import cors from 'cors';
import { globalErrorHandler } from './middlewares/GlobalErrorHandler';
import authRoutes from './routes/auth.routes';
import cookieParser from 'cookie-parser';
import conversationRoutes from './routes/conversation.routes';
import userRoutes from './routes/user.routes';
import messageRoutes from './routes/messages.routes';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,             
}));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/conversation", conversationRoutes)
app.use('/users', userRoutes);
app.use('/messages', messageRoutes)

app.use(globalErrorHandler);
export default app;