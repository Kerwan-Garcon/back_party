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
import { AuthService } from './services/auth.service';
import { RatingController } from './controller/rating.controller';
import { RatingService } from './services/rating.service';
import { MessageController } from './controller/message.controller';
import { MessageService } from './services/message.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controller/auth.controller';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt.guards';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30d' }
      }),
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CacheModule.register({
      ttl: 2000,
      max: 20
    })
  ],
  controllers: [
    AppController,
    UsersController,
    EventController,
    EventParticipationController,
    RatingController,
    MessageController,
    AuthController
  ],
  providers: [
    AppService,
    UsersService,
    PrismaService,
    EventService,
    EventParticipationService,
    AuthService,
    RatingService,
    MessageService,
    JwtStrategy,
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ]
})
export class AppModule {}
