import { User } from '../../auth/entity/user.class';

export class CreatePostDto {
    readonly content: string;
    author: User;
}
