import express from 'express';
import { createConversation, getConversations } from '../controllers/conversation.controller';
import { authenticate } from '../middlewares/auth.middleware';

const conversationRoutes = express.Router();

conversationRoutes.post('/', authenticate, createConversation);
conversationRoutes.get('/', authenticate, getConversations);

export default conversationRoutes;