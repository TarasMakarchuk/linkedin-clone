import { Role } from './role.enum';
import { PostEntity } from '../../post/entity/post.entity';

export class User {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    imagePath?: string;
    role?: Role;
    posts?: PostEntity[];
}