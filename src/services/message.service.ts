import { Injectable } from '@nestjs/common';
import { Prisma, Message } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(data: Prisma.MessageCreateInput): Promise<Message> {
    return this.prisma.message.create({ data });
  }

  async getMessages(): Promise<Message[]> {
    return this.prisma.message.findMany({
      include: { sender: true, receiver: true }
    });
  }

  async getMessageById(id: number): Promise<Message | null> {
    return this.prisma.message.findUnique({ where: { id } });
  }

  async getMessageByUserId(userId: number): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      include: { sender: true, receiver: true }
    });
  }

  async updateMessage(
    id: number,
    data: Prisma.MessageUpdateInput
  ): Promise<Message> {
    return this.prisma.message.update({ where: { id }, data });
  }

  async deleteMessage(id: number) {
    return this.prisma.message.delete({ where: { id } });
  }
}
