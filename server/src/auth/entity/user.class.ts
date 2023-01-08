import { Role } from './role.enum';
import { FeedPost } from '../../post/entity/post.class';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

const PASSWORD_MIN_LENGTH = 1;
const PASSWORD_MAX_LENGTH = 50;

export class User {
    id?: number;
    firstName?: string;
    lastName?: string;

    @IsEmail()
    email?: string;

    @IsString()
    @MinLength(PASSWORD_MIN_LENGTH, {
        message: `Password should be more than ${PASSWORD_MIN_LENGTH} characters`
    })
    @MaxLength(PASSWORD_MIN_LENGTH, {
        message: `Password should be less than ${PASSWORD_MAX_LENGTH} characters`
    })
    password?: string;

    imagePath?: string;
    role?: Role;
    posts?: FeedPost[];
}
