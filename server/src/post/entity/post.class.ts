import { User } from '../../auth/entity/user.class';

export class FeedPost {
    id?: number;
    content?: string;
    author?: User;
}
