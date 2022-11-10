import { Injectable } from '@nestjs/common';
import { PostEntity } from './entity/post.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { from, Observable } from 'rxjs';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly feedPostRepository: Repository<PostEntity>
    ) {}

    async create(dto: CreatePostDto): Promise<Observable<CreatePostDto>> {
        return from(this.feedPostRepository.save(dto));
    };

    async getAll(): Promise<Observable<CreatePostDto[]>> {
        return from(this.feedPostRepository.find());
    };

    async update(id: number, dto: UpdatePostDto): Promise<Observable<UpdateResult>> {
        return from(this.feedPostRepository.update( id, dto));
    };

    async delete(id: number): Promise<Observable<DeleteResult>> {
        return from(this.feedPostRepository.delete(id));
    };
}
