import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { Observable, ObservedValueOf } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entity/post.entity';

@Controller('posts')
export class PostController {
    constructor(private  feedPostService: PostService) {}

    @Post()
    create(@Body() dto: CreatePostDto): Promise<Observable<CreatePostDto>> {
        return this.feedPostService.create(dto);
    };

    @Get()
    findSelected(
        @Query('take') take: number = 10,
        @Query('skip') skip: number = 0,
    ): Promise<Observable<ObservedValueOf<Promise<[PostEntity[], number]>>>> {
        take = take > 20 ? 20 : take;
        return this.feedPostService.findSelected(take, skip);
    };

    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() dto: UpdatePostDto
    ): Promise<Observable<UpdateResult>>  {
        return this.feedPostService.update(id, dto);
    };

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.feedPostService.delete(id);
    };
}
