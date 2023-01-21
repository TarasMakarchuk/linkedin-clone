import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {from, map, Observable, of, switchMap, tap} from 'rxjs';
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

    doesUserExist(email: string): Observable<boolean> {
        return from(this.userRepository.findOne({
            where: [{ email }],
        })).pipe(
            switchMap((user: User) => {
                return of(!!user);
            }),
        );
    }

   registerUserAccount(user: User): Observable<User> {
        const { firstName, lastName, email, password } = user;

        return this.doesUserExist(email).pipe(
            tap((doesUserExist: boolean) =>{
                if(doesUserExist) {
                    throw new HttpException(
                        'A user has already been created with this email address',
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }),
            switchMap(() => {
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
                    }),
                );
            }),
        );
    };

    validateUser(email: string, password: string): Observable<User> {
        return from(
            this.userRepository.findOne({
                select: ['id', 'firstName', 'lastName', 'email', 'password', 'role'],
                where: [{ email }],
        },
            ),
        ).pipe(switchMap((user: User) => {
            if (!user) {
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN, error: 'Invalid credentials',
                }, HttpStatus.FORBIDDEN);
            }
            return from(bcrypt.compare(password, user.password)).pipe(
                map((isValidPassword: boolean) => {
                    if (isValidPassword) {
                        delete user.password;
                        return user;
                    }
                }),
            )
        }));
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
