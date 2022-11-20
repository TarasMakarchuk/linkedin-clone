import { Injectable } from '@nestjs/common';
import { PostEntity } from './entity/post.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { from, Observable, ObservedValueOf } from 'rxjs';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>
    ) {}

    async create(dto: CreatePostDto): Promise<Observable<CreatePostDto>> {
        return from(this.postRepository.save(dto));
    };

    async findSelected(take: number, skip: number): Promise<Observable<ObservedValueOf<Promise<PostEntity[]>>>> {
        return from(this.postRepository.find({ take, skip }));
    };

    async update(id: number, dto: UpdatePostDto): Promise<Observable<UpdateResult>> {
        return from(this.postRepository.update( id, dto));
    };

    async delete(id: number): Promise<Observable<DeleteResult>> {
        return from(this.postRepository.delete(id));
    };
}
