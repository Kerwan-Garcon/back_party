import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: any): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { messagesSent: true, messagesReceived: true, location: true }
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
      include: { messagesSent: true, messagesReceived: true, location: true }
    });
  }

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: { messagesSent: true, messagesReceived: true, location: true }
    });
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: number) {
    return this.prisma.$transaction(async (prisma) => {
      await prisma.eventParticipation.deleteMany({
        where: { userId: id }
      });
      await prisma.message.deleteMany({
        where: { OR: [{ senderId: id }, { receiverId: id }] }
      });

      await prisma.userRating.deleteMany({
        where: { OR: [{ ratedId: id }, { raterId: id }] }
      });

      await prisma.user.delete({
        where: { id: id }
      });
    });
  }
}
