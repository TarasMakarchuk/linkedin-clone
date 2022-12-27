import { Injectable } from '@nestjs/common';
import { PostEntity } from './entity/post.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { from, Observable } from 'rxjs';
import { UpdatePostDto } from './dto/update-post.dto';
import { UserEntity } from '../auth/entity/user.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>
    ) {}

    create(user: UserEntity, dto: CreatePostDto): Observable<CreatePostDto> {
        dto.author = user;
        return from(this.postRepository.save(dto));
    };

    findPosts(take: number, skip: number): Observable<PostEntity[]> {
        return from(
            this.postRepository
                .createQueryBuilder('post')
                .innerJoinAndSelect('post.author', 'author')
                .orderBy('post.createdAt', 'DESC')
                .take(take)
                .skip(skip)
                .getMany(),
        )
    };

    update(id: number, dto: UpdatePostDto): Observable<UpdateResult> {
        return from(this.postRepository.update(id, dto));
    };

    delete(id: number): Observable<DeleteResult> {
        return from(this.postRepository.delete(id));
    };

    findById(id: number): Observable<PostEntity> {
        return from(this.postRepository.findOne({
            where: [
                { id },
            ],
            relations: ['author'],
        }));
    };
}
