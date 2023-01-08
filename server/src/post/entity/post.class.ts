import { User } from '../../auth/entity/user.class';
import { IsString } from 'class-validator';

export class FeedPost {
    id?: number;
    @IsString()
    content?: string;
    author?: User;
}
