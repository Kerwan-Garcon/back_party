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
import { Prisma, Message } from '@prisma/client';
import { MessageService } from '../services/message.service';

@ApiTags('messages')
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({ summary: 'Create message' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: { type: 'string', required: ['true'] },
        userId: { type: 'number', required: ['true'] }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'The message has been successfully created'
  })
  @Post()
  async createMessage(
    @Body() data: Prisma.MessageCreateInput
  ): Promise<Message> {
    return this.messageService.createMessage(data);
  }

  @ApiOperation({ summary: 'Get all messages' })
  @ApiResponse({
    status: 200,
    description: 'The messages'
  })
  @Get()
  async getMessages(): Promise<Message[]> {
    return this.messageService.getMessages();
  }

  @ApiOperation({ summary: 'Get a message by ID' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiResponse({ status: 200, description: 'The message' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  @Get(':id')
  async getMessageById(@Param('id') id: string): Promise<Message> {
    return this.messageService.getMessageById(+id);
  }

  @ApiOperation({ summary: 'Update a message' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: { type: 'string', required: ['false'] },
        userId: { type: 'number', required: ['false'] }
      }
    }
  })
  @Put(':id')
  async updateMessage(
    @Param('id') id: string,
    @Body() data: Prisma.MessageUpdateInput
  ): Promise<Message> {
    return this.messageService.updateMessage(+id, data);
  }

  @ApiOperation({ summary: 'Delete a message' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiResponse({ status: 200, description: 'Message deleted' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  @Delete(':id')
  async deleteMessage(@Param('id') id: string) {
    return this.messageService.deleteMessage(+id);
  }
}
