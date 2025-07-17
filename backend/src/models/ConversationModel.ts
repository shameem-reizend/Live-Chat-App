import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { User } from './UserModel';
import { Message } from './MessageModel';

@Entity()
@Unique(['user1', 'user2'])
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { eager: true })
  user1!: User;

  @ManyToOne(() => User, { eager: true })
  user2!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Message, (message) => message.conversation)
  messages!: Message[];
}
