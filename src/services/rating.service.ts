import { Injectable } from '@nestjs/common';
import { Prisma, UserRating } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async createRating(data: Prisma.UserRatingCreateInput): Promise<UserRating> {
    return this.prisma.userRating.create({ data });
  }

  async getRatings(): Promise<UserRating[]> {
    return this.prisma.userRating.findMany({
      include: { rated: true, rater: true }
    });
  }

  async getRatingById(id: number): Promise<UserRating | null> {
    return this.prisma.userRating.findUnique({ where: { id } });
  }

  async getRatingByUserId(userId: number) {
    const userRating = await this.prisma.userRating.findFirst({
      where: {
        ratedId: userId
      }
    });

    const result = await this.prisma.userRating.aggregate({
      _avg: {
        rating: true
      },
      where: {
        ratedId: userId
      }
    });

    return { comment: userRating.comment, rating: result };
  }

  async updateRating(
    id: number,
    data: Prisma.UserRatingUpdateInput
  ): Promise<UserRating> {
    return this.prisma.userRating.update({ where: { id }, data });
  }

  async deleteRating(id: number) {
    return this.prisma.userRating.delete({ where: { id } });
  }
}
