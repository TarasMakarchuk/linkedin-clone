import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entity/post.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([PostEntity]),
  ],
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule {}
