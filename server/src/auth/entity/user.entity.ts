import { PostEntity } from '../../post/entity/post.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './role.enum';
import { FriendRequestEntity } from './friend-request.entity';

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'first_name'})
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ nullable: true })
    imagePath: string;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => PostEntity, (postEntity) => postEntity.author)
    posts: PostEntity[];

    @OneToMany(
        () => FriendRequestEntity,
        (friendRequestEntity) => friendRequestEntity.creator,
    )
    sentFriendRequests: FriendRequestEntity[];

    @OneToMany(
        () => FriendRequestEntity,
        (friendRequestEntity) => friendRequestEntity.receiver,
    )
    receivedFriendRequests: FriendRequestEntity[];
}
