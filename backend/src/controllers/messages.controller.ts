import { NextFunction, Request, Response } from 'express';
import { Message } from '../models/MessageModel';
import { AppDataSource } from "../config/data-source";
import { AppError } from "../utils/AppError";
import { Conversation } from '../models/ConversationModel';

export const saveMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, text, type, timestamp, senderId, receiverId, conversationId } = req.body;
    
    const messageRepository = AppDataSource.getRepository(Message);
    const conversationRepo = AppDataSource.getRepository(Conversation);
    const conversation = await conversationRepo.findOneBy({ id: conversationId });
    if (!conversation) {
      return next(new AppError('Conversation not found', 404));
    }
    await conversationRepo.update(conversationId, { lastMessage: text });
    const newMessage = messageRepository.create({
      id,
      text,
      type,
      timestamp,
      isSent: true,
      isRead: false,
      senderId,
      receiverId,
      conversationId
    });
    
    await messageRepository.save(newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    next(new AppError('Failed to save message', 500));
  }
};

export const getMessagesByConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { conversationId } = req.params;
    
    const messageRepository = AppDataSource.getRepository(Message);
    const messages = await messageRepository.find({
      where: { conversationId },
      order: { timestamp: 'ASC' },
      relations: ['sender', 'receiver']
    });

    const formattedMessages = messages.map(message => ({
      ...message,
      timestamp: formatTime(message.timestamp)
    }));
    
    res.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    next(new AppError('Failed to fetch messages', 500))
  }
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};