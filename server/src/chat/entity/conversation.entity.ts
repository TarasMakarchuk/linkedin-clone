import { Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../auth/entity/user.entity';
import { MessageEntity } from './message.entity';

@Entity('conversation')
export class ConversationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => UserEntity)
    @JoinTable()
    users: UserEntity[];

    @OneToMany(
        () => MessageEntity,
        (messageEntity: MessageEntity) => messageEntity.conversation,
    )
    messages: MessageEntity[];

    @UpdateDateColumn({ name: 'last_update' })
    lastUpdate: Date;
}
