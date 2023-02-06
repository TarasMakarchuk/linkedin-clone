import { User } from '../../auth/entity/user.class';
import { Conversation } from './conversation.interface';

export interface Message {
    id?: number;
    message?: string;
    user?: User;
    conversation?: Conversation;
    createdAt?: Date;
}
