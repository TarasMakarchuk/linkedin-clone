import { Injectable } from '@nestjs/common';
import { from, map, Observable } from 'rxjs';
import { UserEntity } from '../entity/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {}

    findById(id: number): Observable<UserEntity> {
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
        user.avatar = imagePath;

        return from(this.userRepository.update(id, user));
    };

    findAvatarNameByUserId(id: number): Observable<string> {
        return from(this.userRepository.findOne({
            where: { id },
        })).pipe(
            map((user: UserEntity) => {
                delete user.password;
                return user.avatar;
            })
        );
    };
}
