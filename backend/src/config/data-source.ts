import * as dotenv from 'dotenv';
dotenv.config(); 
import { DataSource } from 'typeorm'
import { User } from '../models/UserModel';
import { Conversation } from '../models/ConversationModel';
import { Message } from '../models/MessageModel';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Conversation, Message],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});