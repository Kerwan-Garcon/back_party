import { Injectable } from '@nestjs/common';
import {
  Prisma,
  EventParticipation,
  ParticipationStatus
} from '@prisma/client';
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

  async getEventParticipationById(id: number) {
    return this.prisma.eventParticipation.findFirst({
      where: { eventId: id },
      include: { user: true, event: true }
    });
  }

  async getEventParticipationByEventUserId(
    eventId: number,
    userId: number
  ): Promise<EventParticipation> {
    return this.prisma.eventParticipation.findFirst({
      where: { eventId, userId },
      include: { user: true, event: true }
    });
  }

  async getEventParticipationByUserId(
    userId: number
  ): Promise<EventParticipation[]> {
    return this.prisma.eventParticipation.findMany({
      where: { userId }
    });
  }

  async updateEventParticipation(
    { eventId, userId }: { eventId: number; userId: number },
    data: Prisma.EventParticipationUpdateInput
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.$transaction(async (prisma) => {
      const eventParticipation = await prisma.eventParticipation.updateMany({
        where: { eventId, userId },
        data
      });

      if ((data.status as ParticipationStatus) === 'APPROVED') {
        await prisma.event.update({
          where: { id: eventId },
          data: {
            remainingSpots: {
              decrement: 1
            }
          }
        });
      }

      return eventParticipation;
    });
  }

  async deleteEventParticipation(eventId: number, userId: number) {
    return this.prisma.$transaction(async (prisma) => {
      const eventParticipation = await prisma.eventParticipation.findFirst({
        where: { eventId, userId }
      });

      await prisma.eventParticipation.deleteMany({
        where: { eventId, userId }
      });

      if (eventParticipation?.status === 'APPROVED') {
        await prisma.event.update({
          where: { id: eventId },
          data: {
            remainingSpots: {
              increment: 1
            }
          }
        });
      }
    });
  }
}
