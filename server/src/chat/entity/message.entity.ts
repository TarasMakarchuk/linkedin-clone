import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ConversationEntity } from './conversation.entity';
import { UserEntity } from '../../auth/entity/user.entity';

@Entity('message')
export class MessageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(
        () => UserEntity,
        (userEntity: UserEntity) => userEntity.messages,
        )
    user: UserEntity;

    @ManyToOne(
        () => ConversationEntity,
        (conversationEntity: ConversationEntity) => conversationEntity.messages,
    )
    conversation: ConversationEntity;
}
