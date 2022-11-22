import { Body, Controller, Post } from '@nestjs/common';
import { IUser } from './entity/user.interface';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('registration')
    registration(@Body() dto: IUser): Observable<IUser> {
        return this.authService.registration(dto);
    };
}
