import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Login, LoginResponse } from 'src/interfaces/login.interfaces';

@Injectable()
export class LoginService {
  constructor(private prisma: PrismaService) {}

  async login(data: Login): Promise<LoginResponse> {
    return this.prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true, email: true, password: true }
    });
  }
}
