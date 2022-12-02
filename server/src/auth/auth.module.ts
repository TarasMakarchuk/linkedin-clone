import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
      TypeOrmModule.forFeature([UserEntity]),
      JwtModule.registerAsync({
          useFactory: () => ({
              secret: process.env.JWT_SECRET,
              signOptions: {
                  expiresIn: '31d',
              },
          }),
      }),
  ],
  providers: [AuthService, JwtGuard, JwtStrategy, RolesGuard],
  controllers: [AuthController],
  exports: [AuthService],
})

export class AuthModule {}
