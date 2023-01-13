import { Body, Controller, Post } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../entity/user.class';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('registration')
    registration(@Body() user: User): Observable<User> {
        return this.authService.registration(user);
    };

    @Post('login')
    login(@Body() user: User): Observable<{ token: string; }> {
        return this.authService
            .login(user)
            .pipe(map((jwt: string) => ({ token: jwt })));
    };
}
