import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './controller/user.controller';
import { UsersService } from './services/user.service';
import { PrismaService } from './services/prisma.service';
import { EventService } from './services/event.service';
import { EventController } from './controller/event.controller';
import { EventParticipationController } from './controller/eventParticipation.controller';
import { EventParticipationService } from './services/eventParticipation.service';
import { LoginService } from './services/login.service';
import { RatingController } from './controller/rating.controller';
import { RatingService } from './services/rating.service';
import { MessageController } from './controller/message.controller';
import { MessageService } from './services/message.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    UsersController,
    EventController,
    EventParticipationController,
    RatingController,
    MessageController
  ],
  providers: [
    AppService,
    UsersService,
    PrismaService,
    EventService,
    EventParticipationService,
    LoginService,
    RatingService,
    MessageService
  ]
})
export class AppModule {}
