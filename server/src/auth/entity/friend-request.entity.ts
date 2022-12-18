import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { FriendRequest_Status } from './friend-request.interface';
import { UserEntity } from './user.entity';

@Entity('friend-request')
export class FriendRequestEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: FriendRequest_Status;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.sentFriendRequests)
    creator: UserEntity;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.receivedFriendRequests)
    receiver: UserEntity;
}
