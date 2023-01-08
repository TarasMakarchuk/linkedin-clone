import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { dataSourceOptions } from '../db/data-source';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './core/all-exceptions.filter';

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
      }),
      TypeOrmModule.forRoot(dataSourceOptions),
      PostModule,
      AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
  }],
})
export class AppModule {}
