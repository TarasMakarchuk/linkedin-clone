import { FriendRequestStatusEnum } from './friend-request.enum';
import { UserEntity } from './user.entity';

export type FriendRequest_Status = FriendRequestStatusEnum;

export interface FriendRequestStatus {
    status?: FriendRequest_Status;
}

export interface FriendRequest {
    id?: number;
    creator?: UserEntity;
    receiver?: UserEntity;
    status?: FriendRequest_Status;
}
