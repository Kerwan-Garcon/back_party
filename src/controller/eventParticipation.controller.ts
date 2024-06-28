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
import { EventParticipationService } from '../services/eventParticipation.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

@ApiTags('events')
@Controller('events')
export class EventParticipationController {
  constructor(
    private readonly eventParticipationService: EventParticipationService
  ) {}

  @ApiOperation({ summary: 'Create event participation' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        eventId: { type: 'number', required: ['true'] },
        userId: { type: 'number', required: ['true'] },
        status: {
          type: 'string',
          required: ['false'],
          examples: ['PENDING', 'ACCEPTED', 'REJECTED']
        },
        paymentStatus: {
          type: 'string',
          required: ['false'],
          examples: ['PENDING', 'PAID', 'NONE']
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'The event participation has been successfully created'
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
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

  @ApiOperation({ summary: 'Get all event participations' })
  @ApiResponse({ status: 200, description: 'The event participations' })
  @ApiResponse({ status: 404, description: 'Event participations not found' })
  @Get('participations/all')
  async getEventParticipations(): Promise<EventParticipation[]> {
    return this.eventParticipationService.getEventParticipations();
  }

  @ApiOperation({ summary: 'Get event participation by ID' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiResponse({ status: 200, description: 'The event participation' })
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

  @ApiOperation({ summary: 'Get event participation by user ID' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiResponse({ status: 200, description: 'The event participation' })
  @Get('user/:id')
  async getEventParticipationByUserId(
    @Param('id') id: string
  ): Promise<EventParticipation[]> {
    return this.eventParticipationService.getEventParticipationByUserId(+id);
  }

  @ApiOperation({ summary: 'Update event participation' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          required: ['false'],
          examples: ['PENDING', 'ACCEPTED', 'REJECTED']
        },
        paymentStatus: {
          type: 'string',
          required: ['false'],
          examples: ['PENDING', 'PAID', 'NONE']
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'The updated event participation' })
  @ApiResponse({ status: 404, description: 'Event participation not found' })
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

  @ApiOperation({ summary: 'Delete event participation' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiParam({ name: 'userId', required: true, example: 1 })
  @ApiResponse({ status: 200, description: 'Event participation deleted' })
  @ApiResponse({ status: 404, description: 'Event participation not found' })
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
