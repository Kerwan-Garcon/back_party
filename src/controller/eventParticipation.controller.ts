import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  BadRequestException
} from '@nestjs/common';
import { Prisma, EventParticipation } from '@prisma/client';
import { EventParticipationService } from 'src/services/eventParticipation.service';

@Controller('eventParticipations')
export class EventParticipationController {
  constructor(
    private readonly eventParticipationService: EventParticipationService
  ) {}

  @Post()
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

  @Get()
  async getEventParticipations(): Promise<EventParticipation[]> {
    return this.eventParticipationService.getEventParticipations();
  }

  @Get(':id')
  async getEventParticipationById(
    @Param('id') id: string
  ): Promise<EventParticipation> {
    return this.eventParticipationService.getEventParticipationById(+id);
  }

  @Get('user/:id')
  async getEventParticipationByUserId(
    @Param('id') id: string
  ): Promise<EventParticipation[]> {
    return this.eventParticipationService.getEventParticipationByUserId(+id);
  }

  @Put(':id')
  async updateEventParticipation(
    @Param('id') id: string,
    @Body() data: Prisma.EventParticipationUpdateInput
  ): Promise<EventParticipation> {
    return this.eventParticipationService.updateEventParticipation(+id, data);
  }

  @Delete(':id')
  async deleteEventParticipation(@Param('id') id: string) {
    return this.eventParticipationService.deleteEventParticipation(+id);
  }
}
