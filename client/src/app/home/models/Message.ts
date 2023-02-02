import { User } from '../../auth/models/user.model';
import { Conversation } from './Conversation';

export interface Message {
  id?: number;
  message?: string;
  user?: User;
  conversation?: Conversation;
  created_at?: Date;
  updated_at?: Date;
}
