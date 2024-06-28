import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Prisma, UserRating } from '@prisma/client';
import { RatingService } from '../services/rating.service';

@ApiTags('ratings')
@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @ApiOperation({ summary: 'Create rating' })
  @ApiResponse({
    status: 201,
    description: 'The rating has been successfully created'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', required: ['true'] },
        rating: { type: 'number', required: ['true'] },
        comment: { type: 'string', required: ['false'] }
      }
    }
  })
  @Post()
  async createRating(
    @Body() data: Prisma.UserRatingCreateInput
  ): Promise<UserRating> {
    return this.ratingService.createRating(data);
  }

  @ApiOperation({ summary: 'Get all ratings' })
  @ApiResponse({
    status: 200,
    description: 'The ratings'
  })
  @Get()
  async getRatings(): Promise<UserRating[]> {
    return this.ratingService.getRatings();
  }

  @ApiOperation({ summary: 'Get a rating by ID' })
  @ApiResponse({ status: 200, description: 'The rating' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  @Get(':id')
  async getRatingById(@Param('id') id: string): Promise<UserRating> {
    return this.ratingService.getRatingById(+id);
  }

  @ApiOperation({ summary: 'Get a rating by user ID' })
  @ApiResponse({ status: 200, description: 'The rating' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  @Get('user/:id')
  async getRatingByUserId(@Param('id') id: string) {
    return this.ratingService.getRatingByUserId(+id);
  }

  @ApiOperation({ summary: 'Update a rating' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        rating: { type: 'number', required: ['false'] },
        comment: { type: 'string', required: ['false'] }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'The updated rating' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  @Put(':id')
  async updateRating(
    @Param('id') id: string,
    @Body() data: Prisma.UserRatingUpdateInput
  ): Promise<UserRating> {
    return this.ratingService.updateRating(+id, data);
  }

  @ApiOperation({ summary: 'Delete a rating' })
  @ApiResponse({ status: 200, description: 'Rating deleted' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @Delete(':id')
  async deleteRating(@Param('id') id: string) {
    return this.ratingService.deleteRating(+id);
  }
}
