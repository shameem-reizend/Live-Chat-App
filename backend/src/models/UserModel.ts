import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import {Message} from './MessageModel';
import { Conversation } from './ConversationModel';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  // 👇 Relations (optional but helpful for ORM use)

  // Messages sent by this user
  @OneToMany(() => Message, (message) => message.sender)
  sentMessages!: Message[];

  // Messages received by this user
  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages!: Message[];

  // Conversations where this user is user1
  @OneToMany(() => Conversation, (conversation) => conversation.user1)
  conversationsInitiated!: Conversation[];

  // Conversations where this user is user2
  @OneToMany(() => Conversation, (conversation) => conversation.user2)
  conversationsReceived!: Conversation[];
}
