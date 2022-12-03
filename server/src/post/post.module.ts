import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entity/post.entity';
import { UserEntity } from '../auth/entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { IsCreatorGuard } from './guards/is-creator.guard';

@Module({
  imports: [
      TypeOrmModule.forFeature([PostEntity, UserEntity]),
      AuthModule,
  ],
  providers: [PostService, IsCreatorGuard],
  controllers: [PostController]
})

export class PostModule {}
