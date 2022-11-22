import { IUser } from '../../auth/entity/user.interface';

export interface IPost {
    id?: number;
    content?: string;
    author?: IUser;
    createdAt?: Date;
    updatedAt?: Date;
}
