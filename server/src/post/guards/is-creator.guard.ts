import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { map, Observable, switchMap } from 'rxjs';
import { UserEntity } from 'src/auth/entity/user.entity';
import { AuthService } from '../../auth/auth.service';
import { PostService } from '../post.service';
import { Role } from '../../auth/entity/role.enum';
import { PostEntity } from '../entity/post.entity';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(
      private authService: AuthService,
      private postService: PostService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params }: { user: UserEntity, params: { id: number } } = request;

    if (!user || !params) return false;
    if (user.role === Role.ADMIN) return true;

    const userId = user.id;
    const postId = params.id;

    return this.authService.findById(userId).pipe(
        switchMap((user: UserEntity) => this.postService.findById(postId).pipe(
            map((post: PostEntity) => {
              return user.id === post.author.id;
            })
        ))
    )
  }
}