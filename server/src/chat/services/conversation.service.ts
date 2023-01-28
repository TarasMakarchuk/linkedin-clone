import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationEntity } from '../entity/conversation.entity';
import { ActiveConversationEntity } from '../entity/active-conversation.entity';
import { MessageEntity } from '../entity/message.entity';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { Conversation } from '../entity/conversation.interface';
import { User } from '../../auth/entity/user.class';

@Injectable()
export class ConversationService {
    constructor(
        @InjectRepository(ConversationEntity)
        private readonly conversationRepository: Repository<ConversationEntity>,
        @InjectRepository(ActiveConversationEntity)
        private readonly activeConversationRepository: Repository<ActiveConversationEntity>,
        @InjectRepository(MessageEntity)
        private readonly messageRepository: Repository<MessageEntity>,
    ) {}

    getConversation(creatorId: number, friendId: number): Observable<Conversation | undefined> {
        return from(
            this.conversationRepository
                .createQueryBuilder('conversation')
                .leftJoin('conversation.users', 'user')
                .where('user.id =: creatorId', { creatorId })
                .orWhere('user.id =: friendId', { friendId })
                .groupBy('conversation.id')
                .having('COUNT(*) > 1')
                .getOne(),
        ).pipe(map((conversation: Conversation) => conversation || undefined));
    };

    createConversation(creator: User, friend: User): Observable<Conversation> {
        return this.getConversation(creator.id, friend.id).pipe(
            switchMap((conversation: Conversation) => {
                const doesConversationExist = !!conversation;
                if (!doesConversationExist) {
                  const newConversation: Conversation = {
                      users: [creator, friend],
                  };
                  return from(this.conversationRepository.save(newConversation));
                }
               return of(conversation);
            }),
        );
    };

    getConversationsForUser(userId: number): Observable<Conversation[]> {
        return from(this.conversationRepository
            .createQueryBuilder('conversation')
            .leftJoin('conversation.users', 'user')
            .where('user.id =: userId', { userId })
            .orderBy('conversation.lastUpdated', 'DESC')
            .getMany(),
        );
    };

    getUsersInConversation(conversationId: number): Observable<Conversation[]> {
        return from(this.conversationRepository
            .createQueryBuilder('conversation')
            .innerJoinAndSelect('conversation.users', 'user')
            .where('conversation.id =: conversationId', { conversationId })
            .getMany(),
        );
    };
}
