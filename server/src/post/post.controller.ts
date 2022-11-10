import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { Observable } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostController {
    constructor(private  feedPostService: PostService) {}

    @Post()
    create(@Body() dto: CreatePostDto): Promise<Observable<CreatePostDto>> {
        return this.feedPostService.create(dto);
    };

    @Get()
    getAll(): Promise<Observable<CreatePostDto[]>> {
        return this.feedPostService.getAll();
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
