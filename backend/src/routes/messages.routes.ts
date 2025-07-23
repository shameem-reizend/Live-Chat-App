import express from 'express';
import { getMessagesByConversation, getUnreadMessages, readMessages, saveMessage } from '../controllers/messages.controller';

const messageRoutes = express.Router();

messageRoutes.post('/', saveMessage);
messageRoutes.get('/:conversationId', getMessagesByConversation);
messageRoutes.post('/unread', getUnreadMessages);
messageRoutes.post('/read', readMessages);

export default messageRoutes;