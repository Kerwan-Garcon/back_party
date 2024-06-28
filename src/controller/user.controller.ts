import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  Delete,
  Query
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Prisma, User } from '@prisma/client';
import { UsersService } from '../services/user.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.usersService.getUsers(pageNumber, limitNumber);
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiResponse({ status: 200, description: 'The user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(+id);
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', required: ['false'] },
        password: { type: 'string', required: ['false'] },
        name: { type: 'string', required: ['false'] },
        age: { type: 'number', required: ['false'] },
        interests: {
          type: 'array',
          items: { type: 'string' },
          required: ['false']
        },
        isOrganizer: { type: 'boolean', required: ['false'] },
        createdAt: { type: 'string', format: 'date-time', required: ['false'] },
        updatedAt: { type: 'string', format: 'date-time', required: ['false'] }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'The updated user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Prisma.UserUpdateInput
  ): Promise<User> {
    return this.usersService.updateUser(+id, data);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }
}
