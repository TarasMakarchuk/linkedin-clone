import { FriendRequestStatusEnum } from './friend-request.enum';

export type FriendRequest_Status = FriendRequestStatusEnum;

export interface FriendRequestStatus {
  status?: FriendRequest_Status;
}

export interface FriendRequest {
  id: number;
  creatorId: number;
  receiverId: number;
  status?: FriendRequest_Status;
}
