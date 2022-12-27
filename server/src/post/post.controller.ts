import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { Observable } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entity/post.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Roles } from '../auth/decorators/roles/roles.decorator';
import { Role } from '../auth/entity/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { IsCreatorGuard } from './guards/is-creator.guard';

@Controller('posts')
export class PostController {
    constructor(private postService: PostService) {}

    @Roles(Role.ADMIN, Role.PREMIUM, Role.USER)
    @UseGuards(JwtGuard, RolesGuard)
    @Post()
    create(@Body() dto: CreatePostDto, @Request() req): Observable<CreatePostDto> {
        return this.postService.create(req.user, dto);
    };

    @UseGuards(JwtGuard)
    @Get()
    findPosts(
        @Query('take') take: number = 10,
        @Query('skip') skip: number = 0,
    ): Observable<PostEntity[]> {
        take = take > 20 ? 20 : take;
        return this.postService.findPosts(take, skip);
    };

    @UseGuards(JwtGuard, IsCreatorGuard)
    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() dto: UpdatePostDto
    ): Observable<UpdateResult>  {
        return this.postService.update(id, dto);
    };

    @UseGuards(JwtGuard, IsCreatorGuard)
    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.postService.delete(id);
    };
}
