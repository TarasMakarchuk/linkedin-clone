import { UserEntity } from '../../auth/entity/user.entity';

export class CreatePostDto {
    readonly content: string;
    author: UserEntity;
}
