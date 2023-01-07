import { Role } from './role.enum';
import { FeedPost } from '../../post/entity/post.class';
import { IsEmail, IsString } from 'class-validator';

export class User {
    id?: number;
    firstName?: string;
    lastName?: string;
    @IsEmail()
    email?: string;
    @IsString()
    password?: string;
    imagePath?: string;
    role?: Role;
    posts?: FeedPost[];
}