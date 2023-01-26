import { User } from '../../auth/entity/user.class';

export interface Conversation {
    id?: number;
    users?: User[];
    lastUpdated?: Date;
}
