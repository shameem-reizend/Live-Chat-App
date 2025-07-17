import { NextFunction, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Conversation } from "../models/ConversationModel";
import { AppError } from "../utils/AppError";


export const createConversation = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const conversationRepo = AppDataSource.getRepository(Conversation);
    const { user2 } = req.body;
    const user1 = req.user.id;
    
    try {
        const existing = await conversationRepo
            .createQueryBuilder("conversation")
            .where(
                "(conversation.user1 = :user1 AND conversation.user2 = :user2) OR (conversation.user1 = :user2 AND conversation.user2 = :user1)",
                { user1, user2 }
            )
            .getOne();
        
        if (existing) {
            next(new AppError('Conversation already exists', 409));
            return;
        }

        const conversation = conversationRepo.create({
            user1: { id: user1 },
            user2: { id: user2 }
        });
        
        await conversationRepo.save(conversation);

        const fullConversation = await conversationRepo.findOne({
            where: { id: conversation.id },
            relations: ['user1', 'user2']
        });

        if (!fullConversation) {
            next(new AppError('Failed to create conversation', 500));
            return;
        }

        res.status(201).json(fullConversation);
    } catch (error) {
        next(new AppError('Server error', 500));
    }
}

export const getConversations = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const conversationRepo = AppDataSource.getRepository(Conversation);
    const userId = req.user.id;

    try {
        const conversations = await conversationRepo.find({
            where: [
                { user1: { id: userId } },
                { user2: { id: userId } }
            ],
            relations: ['user1', 'user2'],
            order: {
                createdAt: 'DESC'
            }
        });

        res.status(200).json(conversations);
    } catch (error) {
        next(new AppError('server error', 500));
    }
}