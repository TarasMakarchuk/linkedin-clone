import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { from, map, Observable, switchMap } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

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

   async registration(dto: CreateUserDto): Promise<Observable<UserEntity>> {
        const { firstName, lastName, email, password } = dto;
        const found = await this.userRepository.findOne({ where: { email }});
        if (found) throw new BadRequestException(`This email is already in use`);

        return this.hashPassword(password).pipe(
            switchMap((hashedPassword: string) => {
                return from (this.userRepository.save({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                })).pipe(
                    map((user: UserEntity) => {
                        delete user.password;
                        return user;
                    })
                );
            })
        );
    };

}
