import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { Observable } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Roles } from '../auth/decorators/roles/roles.decorator';
import { Role } from '../auth/entity/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { IsCreatorGuard } from './guards/is-creator.guard';
import { FeedPost } from './entity/post.class';

@Controller('posts')
export class PostController {
    constructor(private postService: PostService) {}

    // @Roles(Role.ADMIN, Role.PREMIUM, Role.USER)
    @UseGuards(JwtGuard, RolesGuard)
    @Post()
    create(@Body() feedPost: FeedPost, @Request() req): Observable<FeedPost> {
        return this.postService.create(req.user, feedPost);
    };

    @UseGuards(JwtGuard)
    @Get()
    findPosts(
        @Query('take') take: number = 10,
        @Query('skip') skip: number = 0,
    ): Observable<FeedPost[]> {
        take = take > 20 ? 20 : take;
        return this.postService.findPosts(take, skip);
    };

    @UseGuards(JwtGuard, IsCreatorGuard)
    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() feedPost: FeedPost
    ): Observable<UpdateResult>  {
        return this.postService.update(id, feedPost);
    };

    @UseGuards(JwtGuard, IsCreatorGuard)
    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.postService.delete(id);
    };
}
