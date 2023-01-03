import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { from, map, Observable, switchMap } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entity/user.class';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private jwtService: JwtService,
    ) {}

    hashPassword(password: string): Observable<string> {
        const SALT = 10;
        return from(bcrypt.hash(password, SALT));
    };

   async registration(user: User): Promise<Observable<User>> {
        const { firstName, lastName, email, password } = user;
        const found = await this.userRepository.findOne({
            where: [{ email }],
        });
        if (found) throw new BadRequestException(`This email is already in use`);

        return this.hashPassword(password).pipe(
            switchMap((hashedPassword: string) => {
                return from (this.userRepository.save({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                })).pipe(
                    map((user: User) => {
                        delete user.password;
                        return user;
                    })
                );
            })
        );
    };

    validateUser(email: string, password: string): Observable<User> {
        return from(
            this.userRepository.findOne({
                select: ['id', 'firstName', 'lastName', 'email', 'password', 'role'],
                where: [{ email }],
        },
            ),
        ).pipe(switchMap((user: User) =>
            from(bcrypt.compare(password, user.password)).pipe(
                map((isValidPassword: boolean) => {
                    if (isValidPassword) {
                        delete user.password;
                        return user;
                    }
                })
            )
        ));
    };

    login(user: User): Observable<string> {
        const { email, password } = user;
        return this.validateUser(email, password).pipe(
           switchMap((user: User) => {
               if (user) {
                   return from(this.jwtService.signAsync({ user }));
               }
           })
        );
    };

}
