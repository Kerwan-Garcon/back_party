import { Injectable } from '@nestjs/common';
import { Prisma, Event } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async createEvent(data: Prisma.EventCreateInput): Promise<Event> {
    return this.prisma.event.create({ data });
  }

  async createEventWithGames(data: any): Promise<Event> {
    return this.prisma.$transaction(async (prisma) => {
      const { location, games, organizerId, ...eventData } = data;

      const createdLocation = await prisma.location.create({
        data: location
      });

      // a revoir un jour
      const event = await prisma.event.create({
        data: {
          ...eventData,
          games: {
            create: games
          },
          location: {
            connect: { id: createdLocation.id }
          },
          organizer: {
            connect: { id: organizerId }
          }
        }
      });

      return event;
    });
  }

  async getEvents(
    page: number,
    limit: number
  ): Promise<{ data: Event[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const total = await this.prisma.event.count();
    const data = await this.prisma.event.findMany({
      skip: skip,
      take: limit,
      include: {
        games: true,
        organizer: true,
        location: true,
        participants: {
          include: {
            user: true,
            event: true
          }
        }
      }
    });

    return {
      data: data,
      total: total,
      page: page,
      limit: limit
    };
  }

  async getEventById(id: number): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: { id },
      include: {
        games: true,
        organizer: true,
        location: true,
        participants: true
      }
    });
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
      where: { organizerId: id },
      include: {
        games: true,
        organizer: true,
        location: true,
        participants: {
          include: {
            user: true,
            event: true
          }
        }
      }
    });
  }
}
