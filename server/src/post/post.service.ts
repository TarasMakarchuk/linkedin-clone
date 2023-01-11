import { Injectable } from '@nestjs/common';
import { PostEntity } from './entity/post.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { User } from '../auth/entity/user.class';
import { FeedPost } from './entity/post.class';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>
    ) {}

    createPost(user: User, feedPost: FeedPost): Observable<FeedPost> {
        feedPost.author = user;
        return from(this.postRepository.save(feedPost));
    };

    findPosts(take: number, skip: number): Observable<FeedPost[]> {
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

    update(id: number, feedPost: FeedPost): Observable<UpdateResult> {
        return from(this.postRepository.update(id, feedPost));
    };

    delete(id: number): Observable<DeleteResult> {
        return from(this.postRepository.delete(id));
    };

    findById(id: number): Observable<FeedPost> {
        return from(this.postRepository.findOne({
            where: [
                { id },
            ],
            relations: ['author'],
        }));
    };
}
