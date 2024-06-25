import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete
} from '@nestjs/common';
import { Prisma, Message } from '@prisma/client';
import { MessageService } from 'src/services/message.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async createMessage(
    @Body() data: Prisma.MessageCreateInput
  ): Promise<Message> {
    return this.messageService.createMessage(data);
  }

  @Get()
  async getMessages(): Promise<Message[]> {
    return this.messageService.getMessages();
  }

  @Get(':id')
  async getMessageById(@Param('id') id: string): Promise<Message> {
    return this.messageService.getMessageById(+id);
  }

  @Put(':id')
  async updateMessage(
    @Param('id') id: string,
    @Body() data: Prisma.MessageUpdateInput
  ): Promise<Message> {
    return this.messageService.updateMessage(+id, data);
  }

  @Delete(':id')
  async deleteMessage(@Param('id') id: string) {
    return this.messageService.deleteMessage(+id);
  }
}
