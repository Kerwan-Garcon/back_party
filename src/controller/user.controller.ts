import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UsersService } from 'src/services/user.service';
import { LoginService } from 'src/services/login.service';
import { Login, LoginResponse } from 'src/interfaces/login.interfaces';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly loginService: LoginService
  ) {}

  @Post('register')
  async createUser(@Body() data: Prisma.UserCreateInput): Promise<User> {
    return this.usersService.createUser(data);
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(+id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Prisma.UserUpdateInput
  ): Promise<User> {
    return this.usersService.updateUser(+id, data);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }

  @Post('login')
  async login(@Body() data: Login): Promise<LoginResponse> {
    const user = await this.loginService.login(data);

    if (!user) {
      return JSON.parse('{"message": "Invalid email"}');
    }

    const match = await bcrypt.compare(data.password, user.password);

    if (!match) {
      return JSON.parse('{"message": "Invalid password"}');
    }

    return user;
  }
}
