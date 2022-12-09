import { Body, Controller, Post } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entity/user.entity";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('registration')
    registration(@Body() dto: CreateUserDto): Promise<Observable<UserEntity>> {
        return this.authService.registration(dto);
    };

    @Post('login')
    login(@Body() dto: LoginUserDto): Observable<{ token: string; }> {
        return this.authService
            .login(dto)
            .pipe(map((jwt: string) => ({ token: jwt })));
    };
}
