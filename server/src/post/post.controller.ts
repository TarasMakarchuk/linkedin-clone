import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { Observable, ObservedValueOf } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entity/post.entity';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { Roles } from '../auth/decorators/roles/roles.decorator';
import { Role } from '../auth/entity/role.enum';
import { RolesGuard } from '../auth/guards/roles/roles.guard';

@Controller('posts')
export class PostController {
    constructor(private postService: PostService) {}

    @Roles(Role.ADMIN, Role.PREMIUM)
    @UseGuards(JwtGuard, RolesGuard)
    @Post()
    create(@Body() dto: CreatePostDto, @Request() req): Promise<Observable<CreatePostDto>> {
        return this.postService.create(req.user, dto);
    };

    @Get()
    findSelected(
        @Query('take') take: number = 10,
        @Query('skip') skip: number = 0,
    ): Promise<Observable<ObservedValueOf<Promise<PostEntity[]>>>> {
        take = take > 20 ? 20 : take;
        return this.postService.findSelected(take, skip);
    };

    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() dto: UpdatePostDto
    ): Promise<Observable<UpdateResult>>  {
        return this.postService.update(id, dto);
    };

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.postService.delete(id);
    };
}
