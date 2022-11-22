import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../auth/entity/user.entity';

@Entity('post')
export class PostEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    content: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.posts)
    author: UserEntity;
}
