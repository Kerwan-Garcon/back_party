import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete
} from '@nestjs/common';
import { Prisma, UserRating } from '@prisma/client';
import { RatingService } from 'src/services/rating.service';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  async createRating(
    @Body() data: Prisma.UserRatingCreateInput
  ): Promise<UserRating> {
    return this.ratingService.createRating(data);
  }

  @Get()
  async getRatings(): Promise<UserRating[]> {
    return this.ratingService.getRatings();
  }

  @Get(':id')
  async getRatingById(@Param('id') id: string): Promise<UserRating> {
    return this.ratingService.getRatingById(+id);
  }

  @Get('user/:id')
  async getRatingByUserId(@Param('id') id: string) {
    return this.ratingService.getRatingByUserId(+id);
  }

  @Put(':id')
  async updateRating(
    @Param('id') id: string,
    @Body() data: Prisma.UserRatingUpdateInput
  ): Promise<UserRating> {
    return this.ratingService.updateRating(+id, data);
  }

  @Delete(':id')
  async deleteRating(@Param('id') id: string) {
    return this.ratingService.deleteRating(+id);
  }
}
