import { Body, Controller, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import {CreateUserDto} from "./dto/create-user.dto";
import {UserEntity} from "./entity/user.entity";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('registration')
    registration(@Body() dto: CreateUserDto): Promise<Observable<UserEntity>> {
        return this.authService.registration(dto);
    };
}
