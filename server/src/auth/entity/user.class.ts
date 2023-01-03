import { Role } from './role.enum';
import { FeedPost } from '../../post/entity/post.class';

export class User {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    imagePath?: string;
    role?: Role;
    posts?: FeedPost[];
}