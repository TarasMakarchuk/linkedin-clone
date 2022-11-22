import { IPost } from '../../post/entity/post.interface';
import { Role } from './role.enum';

export interface IUser {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: Role;
    posts?: IPost[];
    createdAt?: Date;
    updatedAt?: Date;
}
