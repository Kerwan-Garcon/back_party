import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  BadRequestException,
  Query
} from '@nestjs/common';
import { Prisma, EventParticipation } from '@prisma/client';
import { EventParticipationService } from 'src/services/eventParticipation.service';

@Controller('events')
export class EventParticipationController {
  constructor(
    private readonly eventParticipationService: EventParticipationService
  ) {}

  @Post('participations')
  async createEventParticipation(
    @Body() data: Prisma.EventParticipationCreateInput
  ): Promise<EventParticipation> {
    try {
      if (!data) {
        throw new BadRequestException('event participation data is required');
      }

      return this.eventParticipationService.createEventParticipation(data);
    } catch (error) {
      return error.response;
    }
  }

  @Get('participations')
  async getEventParticipations(): Promise<EventParticipation[]> {
    return this.eventParticipationService.getEventParticipations();
  }

  @Get(':id/participations')
  async getEventParticipationById(
    @Param('id') id: string,
    @Query('userId') userId: string
  ): Promise<EventParticipation> {
    return this.eventParticipationService.getEventParticipationByEventUserId(
      +id,
      +userId
    );
  }

  @Get('user/:id')
  async getEventParticipationByUserId(
    @Param('id') id: string
  ): Promise<EventParticipation[]> {
    return this.eventParticipationService.getEventParticipationByUserId(+id);
  }

  @Put(':id/participations')
  async updateEventParticipation(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body() data: Prisma.EventParticipationUpdateInput
  ): Promise<Prisma.BatchPayload> {
    return this.eventParticipationService.updateEventParticipation(
      { eventId: +id, userId: +userId },
      data
    );
  }

  @Delete(':eventId/participations')
  async deleteEventParticipation(
    @Param('eventId') id: string,
    @Query('userId') userId: string
  ) {
    return this.eventParticipationService.deleteEventParticipation(
      +id,
      +userId
    );
  }
}
