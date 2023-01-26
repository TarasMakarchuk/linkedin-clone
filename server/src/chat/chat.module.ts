import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { ConversationService } from './services/conversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './entity/conversation.entity';
import { ActiveConversationEntity } from './entity/active-conversation.entity';
import { MessageEntity } from './entity/message.entity';

@Module({
  imports: [
      AuthModule,
      TypeOrmModule.forFeature([
          ConversationEntity,
          ActiveConversationEntity,
          MessageEntity,
      ]),
  ],
  providers: [ChatGateway, ConversationService]
})

export class ChatModule {}
