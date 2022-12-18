import { Injectable } from '@nestjs/common';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { UserEntity } from '../entity/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequestEntity } from '../entity/friend-request.entity';
import { FriendRequestStatusEnum } from "../entity/friend-request.enum";
import { FriendRequest } from '../entity/friend-request.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(FriendRequestEntity)
        private friendRequestRepository: Repository<FriendRequestEntity>,
    ) {}

    findUserById(id: number): Observable<UserEntity> {
        return from(this.userRepository.findOne({
                where: { id },
                relations: ['posts'],
            }
        )).pipe(
            map((user: UserEntity) => {
                delete user.password;
                return user;
            }),
        );
    };

    updateAvatarById(id: number, imagePath: string): Observable<UpdateResult> {
        const user: UserEntity = new UserEntity();
        user.id = id;
        user.imagePath = imagePath;

        return from(this.userRepository.update(id, user));
    };

    findAvatarByUserId(id: number): Observable<string> {
        return from(this.userRepository.findOne({
            where: { id },
        })).pipe(
            map((user: UserEntity) => {
                delete user.password;
                return user.imagePath;
            })
        );
    };

    hasRequestSentOrReceived(creator: UserEntity, receiver: UserEntity): Observable<boolean> {
        return from(this.friendRequestRepository.findOne({
            where: [
                {
                    creator,
                    receiver,
                },
                {
                    creator: receiver,
                    receiver: creator,
                },
            ],
        })).pipe(
            switchMap((friendRequest: FriendRequest) => {
                if (!friendRequest) return of(false);
                return of(true);
            })
        );
    };

    sendFriendRequest(receiverId: number, creator: UserEntity): Observable<FriendRequest | { error: string }> {
        if (receiverId === creator.id) return of({ error: 'It is not possible add yourself' });

        return this.findUserById(receiverId).pipe(
            switchMap((receiver: UserEntity) => {
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
                    })
                )
            })
        );
    };
}
