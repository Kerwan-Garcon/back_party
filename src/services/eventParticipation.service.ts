import { Injectable } from '@nestjs/common';
import { Prisma, EventParticipation } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class EventParticipationService {
  constructor(private prisma: PrismaService) {}

  async createEventParticipation(
    data: Prisma.EventParticipationCreateInput
  ): Promise<EventParticipation> {
    return this.prisma.eventParticipation.create({ data });
  }

  async getEventParticipations(): Promise<EventParticipation[]> {
    return this.prisma.eventParticipation.findMany({
      include: { user: true, event: true }
    });
  }

  async getEventParticipationById(
    id: number
  ): Promise<EventParticipation | null> {
    return this.prisma.eventParticipation.findUnique({ where: { id } });
  }

  async getEventParticipationByUserId(
    userId: number
  ): Promise<EventParticipation[]> {
    return this.prisma.eventParticipation.findMany({
      where: { userId }
    });
  }

  async updateEventParticipation(
    id: number,
    data: Prisma.EventParticipationUpdateInput
  ): Promise<EventParticipation> {
    return this.prisma.eventParticipation.update({ where: { id }, data });
  }

  async deleteEventParticipation(id: number) {
    return this.prisma.eventParticipation.delete({ where: { id } });
  }
}
