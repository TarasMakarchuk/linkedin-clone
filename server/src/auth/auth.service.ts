import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { from, map, Observable, switchMap } from 'rxjs';
import { IUser } from './entity/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    hashPassword(password: string): Observable<string> {
        const SALT = 10;
        return from(bcrypt.hash(password, SALT));
    };

    registration(dto: IUser): Observable<IUser> {
        const { firstName, lastName, email, password } = dto;

        const found = this.userRepository.findOne({ where: { email }}).then(data => data);
        if (found) throw new BadRequestException(`This email is already in use`);

        return this.hashPassword(password).pipe(
            switchMap((hashedPassword: string) => {
                return from (this.userRepository.save({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                })).pipe(
                    map((user: IUser) => {
                        delete user.password;
                        return user;
                    })
                );
            })
        );
    };

}
