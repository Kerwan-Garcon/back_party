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
import { Prisma, Event } from '@prisma/client';
import { EventService } from 'src/services/event.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async createEvent(@Body() data: Prisma.EventCreateInput): Promise<Event> {
    try {
      if (!data) {
        throw new BadRequestException('event data is required');
      }

      if (data.games) {
        return this.eventService.createEventWithGames(data);
      }

      return this.eventService.createEvent(data);
    } catch (error) {
      return error.response;
    }
  }

  @Get()
  async getEvents(): Promise<Event[]> {
    return this.eventService.getEvents();
  }

  @Get(':id')
  async getEventById(@Param('id') id: string): Promise<Event> {
    return this.eventService.getEventById(+id);
  }

  @Put(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() data: Prisma.EventUpdateInput
  ): Promise<Event> {
    return this.eventService.updateEvent(+id, data);
  }

  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(+id);
  }

  @Get('user/:id')
  async getEventsByUserId(@Param('id') id: string): Promise<Event[]> {
    return this.eventService.getEventsByUserId(+id);
  }
}
