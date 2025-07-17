import express from 'express';
import { getMessagesByConversation, saveMessage } from '../controllers/messages.controller';

const messageRoutes = express.Router();

messageRoutes.post('/', saveMessage);
messageRoutes.get('/:conversationId', getMessagesByConversation);

export default messageRoutes;