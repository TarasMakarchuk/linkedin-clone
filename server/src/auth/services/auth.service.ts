import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { from, map, Observable, switchMap } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

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

    validateUser(email: string, password: string): Observable<UserEntity> {
        return from(
            this.userRepository.findOne({
                select: ['id', 'firstName', 'lastName', 'email', 'password', 'role'],
                where: { email },
        },
            ),
        ).pipe(switchMap((user: UserEntity) =>
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

    login(dto: LoginUserDto): Observable<string> {
        const { email, password } = dto;
        return this.validateUser(email, password).pipe(
           switchMap((user: UserEntity) => {
               if (user) {
                   return from(this.jwtService.signAsync({ user }));
               }
           })
        );
    }

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

}
