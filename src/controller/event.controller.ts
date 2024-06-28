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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Prisma, Event } from '@prisma/client';
import { EventService } from '../services/event.service';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiOperation({ summary: 'Create party' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', required: ['true'] },
        description: { type: 'string', required: ['true'] },
        location: { type: 'string', required: ['true'] },
        date: { type: 'string', format: 'date-time', required: ['true'] },
        games: {
          type: 'array',
          items: { type: 'object' },
          required: ['false']
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'The event has been successfully created'
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
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

  @ApiOperation({ summary: 'Get all parties' })
  @ApiResponse({ status: 200, description: 'The parties' })
  @ApiResponse({ status: 404, description: 'Parties not found' })
  @Get()
  async getEvents(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<{ data: Event[]; total: number; page: number; limit: number }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.eventService.getEvents(pageNumber, limitNumber);
  }

  @ApiOperation({ summary: 'Get a party by ID' })
  @ApiResponse({ status: 200, description: 'The party' })
  @ApiResponse({ status: 404, description: 'Party not found' })
  @Get(':id')
  async getEventById(@Param('id') id: string): Promise<Event> {
    return this.eventService.getEventById(+id);
  }

  @ApiOperation({ summary: 'Update a party' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', required: ['false'] },
        description: { type: 'string', required: ['false'] },
        location: { type: 'string', required: ['false'] },
        date: { type: 'string', format: 'date-time', required: ['false'] },
        games: {
          type: 'array',
          items: { type: 'object' },
          required: ['false']
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'The updated party' })
  @ApiResponse({ status: 404, description: 'Party not found' })
  @Put(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() data: Prisma.EventUpdateInput
  ): Promise<Event> {
    return this.eventService.updateEvent(+id, data);
  }

  @ApiOperation({ summary: 'Delete a party' })
  @ApiResponse({ status: 200, description: 'Party deleted' })
  @ApiResponse({ status: 404, description: 'Party not found' })
  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(+id);
  }

  @Get('user/:id')
  async getEventsByUserId(
    @Param('id') id: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<{ data: Event[]; total: number; page: number; limit: number }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.eventService.getEventsByUserId(+id, pageNumber, limitNumber);
  }
}
