import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {DeleteResult, Repository} from 'typeorm';
import { ConversationEntity } from '../entity/conversation.entity';
import { ActiveConversationEntity } from '../entity/active-conversation.entity';
import { MessageEntity } from '../entity/message.entity';
import { from, map, mergeMap, Observable, of, switchMap, take } from 'rxjs';
import { Conversation } from '../entity/conversation.interface';
import { User } from '../../auth/entity/user.class';
import { ActiveConversation } from '../entity/active-conversation.interface';
import {Message} from "../entity/message.interface";

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

    getConversationsWithUsers(userId: number): Observable<Conversation[]> {
        return this.getConversationsForUser(userId).pipe(
            take(1),
            switchMap((conversations: Conversation[]) => conversations),
            mergeMap((conversation: Conversation) => {
                return this.getUsersInConversation(conversation.id);
            }),
        );
    };

    joinConversation(friendId: number, userId: number, socketId: string): Observable<ActiveConversation> {
        return this.getConversation(userId, friendId).pipe(
            switchMap((conversation: Conversation) => {
                if (!conversation) {
                    console.warn(`No conversations exists for user id ${userId} and friend id ${friendId}`);
                    return of(null);
                }
                const conversationId = conversation.id;
                return from(this.activeConversationRepository.findOne({
                    where: [{ userId }],
                })).pipe(
                    switchMap((activeConversation: ActiveConversation) => {
                        if (activeConversation) {
                            return from(
                                this.activeConversationRepository.delete({ userId }),
                            ).pipe(
                                switchMap(() => {
                                    return from(
                                        this.activeConversationRepository.save({ socketId, userId, conversationId }),
                                    );
                                }),
                            );
                        } else {
                            return from(
                                this.activeConversationRepository.save({ socketId, userId, conversationId }),
                            );
                        }
                    }),
                );
            }),
        );
    };

    leaveConversation(socketId: string): Observable<DeleteResult> {
        return from(this.activeConversationRepository.delete({ socketId }));
    };

    getActiveUsers(conversationId: number): Observable<User[]> {
        return from(this.activeConversationRepository.find({
            where: [{ conversationId }],
        }));
    };

    createMessage(message: Message): Observable<Message> {
        return from(this.messageRepository.save(message));
    };

    getMessages(conversationId: number): Observable<Message[]> {
        return from(
            this.messageRepository
                .createQueryBuilder('message')
                .innerJoinAndSelect('message.user', 'user')
                .where('message.conversation.id =: conversationId', { conversationId })
                .orderBy('message.createdAt', 'ASC')
                .getMany(),
        );
    };

    removeActiveConversations() {
        return from(
            this.activeConversationRepository.createQueryBuilder().delete().execute(),
        );
    };

    removeMessages() {
        return from(this.messageRepository.createQueryBuilder().delete().execute());
    };

    removeConversations() {
        return from(this.conversationRepository.createQueryBuilder().delete().execute());
    };

}
