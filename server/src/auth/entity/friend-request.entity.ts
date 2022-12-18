import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

type FriendRequestStatus = 'pending' | 'accepted' | 'declined';

@Entity('friend-request')
export class FriendRequestEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: FriendRequestStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.sentFriendRequests)
    creator: UserEntity;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.receivedFriendRequests)
    receiver: UserEntity;
}
