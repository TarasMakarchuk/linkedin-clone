import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controlers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { UserService } from './services/user.service';
import { UserController } from './controlers/user.controller';
import { FriendRequestEntity } from './entity/friend-request.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([UserEntity, FriendRequestEntity]),
      JwtModule.registerAsync({
          useFactory: () => ({
              secret: process.env.JWT_SECRET,
              signOptions: {
                  expiresIn: '365d',
              },
          }),
      }),
  ],
  providers: [
      AuthService,
      JwtGuard,
      JwtStrategy,
      RolesGuard,
      UserService,
  ],
  controllers: [AuthController, UserController],
  exports: [AuthService, UserService],
})

export class AuthModule {}
