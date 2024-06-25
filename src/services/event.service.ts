import { Injectable } from '@nestjs/common';
import { Prisma, Event } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async createEvent(data: Prisma.EventCreateInput): Promise<Event> {
    return this.prisma.event.create({ data });
  }

  async createEventWithGames(data: Prisma.EventCreateInput): Promise<Event> {
    return this.prisma.$transaction(async (prisma) => {
      const gamesData = data.games;
      delete data.games;

      const event = await prisma.event.create({
        data: {
          ...data,
          games: {
            create: Array.isArray(gamesData)
              ? gamesData.map((game) => ({
                  name: game.name
                }))
              : undefined
          }
        },
        include: {
          games: true
        }
      });

      return event;
    });
  }

  async getEvents(): Promise<Event[]> {
    return this.prisma.event.findMany({ include: { games: true } });
  }

  async getEventById(id: number): Promise<Event | null> {
    return this.prisma.event.findUnique({ where: { id } });
  }

  async updateEvent(id: number, data: Prisma.EventUpdateInput): Promise<Event> {
    return this.prisma.event.update({ where: { id }, data });
  }

  async deleteEvent(id: number) {
    return this.prisma.$transaction(async (prisma) => {
      await prisma.eventParticipation.deleteMany({
        where: { eventId: id }
      });

      await prisma.event.delete({
        where: { id: id }
      });
    });
  }

  async getEventsByUserId(id: number): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: { id }
    });
  }
}
