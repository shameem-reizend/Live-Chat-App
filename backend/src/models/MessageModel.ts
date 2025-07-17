import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './UserModel';
import { Conversation } from './ConversationModel';

@Entity()
export class Message {
  @PrimaryColumn('varchar')
  id!: string;

  @Column('text')
  text!: string;

  @Column()
  timestamp!: string; 

  @Column({ default: true })
  isSent!: boolean;

  @Column({ default: false })
  isRead!: boolean;

  @Column()
  senderId!: number;

  @Column()
  receiverId!: number;

  @Column()
  conversationId!: string;


  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'senderId' })
  sender!: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'receiverId' })
  receiver!: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversationId' })
  conversation!: Conversation;
}
