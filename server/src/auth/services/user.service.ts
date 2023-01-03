import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequestEntity } from '../entity/friend-request.entity';
import { FriendRequestStatusEnum } from '../entity/friend-request.enum';
import { FriendRequest, FriendRequestStatus, FriendRequest_Status } from '../entity/friend-request.interface';
import { User } from '../entity/user.class';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(FriendRequestEntity)
        private friendRequestRepository: Repository<FriendRequestEntity>,
    ) {}

    findUserById(userId: number): Observable<User> {
        return from(this.userRepository.findOne({
                where: [
                    { id: userId },
                ],
                relations: ['posts'],
            }
        )).pipe(
            map((user: User) => {
                if (!user) {
                    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
                }
                delete user.password;
                return user;
            }),
        );
    };

    updateAvatarById(id: number, imagePath: string): Observable<UpdateResult> {
        const user: User = new User();
        user.id = id;
        user.imagePath = imagePath;

        return from(this.userRepository.update(id, user));
    };

    findAvatarByUserId(id: number): Observable<string> {
        return from(this.userRepository.findOne({
            where: [
                { id },
            ],
        })).pipe(
            map((user: User) => {
                delete user.password;
                return user.imagePath;
            })
        );
    };

    hasRequestSentOrReceived(creator: User, receiver: User): Observable<boolean> {
        return from(this.friendRequestRepository.findOne({
            where: [
                { creator },
                { receiver },
                { creator: receiver },
                { receiver: creator },
            ],
        })).pipe(
            switchMap((friendRequest: FriendRequest) => {
                if (!friendRequest) return of(false);
                return of(true);
            })
        );
    };

    sendFriendRequest(receiverId: number, creator: User): Observable<FriendRequest | { error: string }> {
        if (receiverId === creator.id) return of({ error: 'It is not possible add yourself' });

        return this.findUserById(receiverId).pipe(
            switchMap((receiver: User) => {
                return this.hasRequestSentOrReceived(creator, receiver).pipe(
                    switchMap((hasRequestSentOrReceived: boolean) => {
                        if (hasRequestSentOrReceived)
                            return of({
                                error: 'A friend request has already been sent or received to your account'
                            });
                        let friendRequest: FriendRequest = {
                            creator,
                            receiver,
                            status: FriendRequestStatusEnum.PENDING,
                        };

                        return from(this.friendRequestRepository.save(friendRequest));
                    }),
                )
            })
        );
    };

    getFriendRequestStatus(receiverId: number, currentUser: User): Observable<FriendRequestStatus> {
        return this.findUserById(receiverId).pipe(
            switchMap((receiver: User) => {
                return from(this.friendRequestRepository.findOne({
                        where: [
                            { creator: currentUser },
                            { receiver: receiver },
                            { creator: receiver },
                            { receiver: currentUser },
                        ],
                        relations: ['creator', 'receiver'],
                    }
                ));
            }),
            switchMap((friendRequest: FriendRequest) => {
                if (friendRequest?.receiver.id === currentUser.id) {
                    return of({ status: FriendRequestStatusEnum.WAITING_TO_CURRENT_USER_RESPONSE as FriendRequest_Status });
                }
                return of({ status: friendRequest?.status || FriendRequestStatusEnum.NOT_SENT });
            }),
        );
    };

    getFriendRequestUserById(requestId: number): Observable<FriendRequest> {
        return from(this.friendRequestRepository.findOne({
            where: [{ id: requestId }],
        }));
    };

    respondToFriendRequest(statusResponse: FriendRequest_Status, requestId: number): Observable<FriendRequestStatus> {
        return this.getFriendRequestUserById(requestId).pipe(
            switchMap((friendRequest: FriendRequest) => {
                return from(this.friendRequestRepository.save({
                    ...friendRequest,
                    status: statusResponse,
                }));
            })
        );
    };

    getAllFriendRequestFromRecipients(currentUser: User): Observable<FriendRequest[]> {
        return from(this.friendRequestRepository.find({
            where: [{ receiver: currentUser }],
            relations: ['receiver', 'creator'],
        }));
    };

}
