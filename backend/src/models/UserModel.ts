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
  static create(arg0: { email: string | undefined; name: string | undefined; avatar: string | undefined; googleId: string; isVerified: boolean; }): void | PromiseLike<void> {
    throw new Error('Method not implemented.');
  }
  static find(arg0: { where: { email: string | undefined; }; }) {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ default: false })
  isOnline!: boolean;

  @Column({ type: "timestamp", nullable: true })
  lastSeen!: Date;


  @OneToMany(() => Message, (message) => message.sender, {onDelete: 'CASCADE'})
  sentMessages!: Message[];

  @OneToMany(() => Message, (message) => message.receiver, {onDelete: 'CASCADE'})
  receivedMessages!: Message[];

  @OneToMany(() => Conversation, (conversation) => conversation.user1, {onDelete: 'CASCADE'})
  conversationsInitiated!: Conversation[];

  @OneToMany(() => Conversation, (conversation) => conversation.user2, {onDelete: 'CASCADE'})
  conversationsReceived!: Conversation[];
}
