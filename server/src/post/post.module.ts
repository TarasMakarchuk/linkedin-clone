import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entity/post.entity';
import { UserEntity } from '../auth/entity/user.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([PostEntity, UserEntity]),
  ],
  providers: [PostService],
  controllers: [PostController]
})

export class PostModule {}
