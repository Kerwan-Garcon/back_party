import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { LoginDto } from 'src/dto/login.dto';
import { RegisterDto } from 'src/dto/register.dto';
import { Public } from 'src/decorators/public.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  //   @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() data: LoginDto) {
    const user = await this.authService.validateUser(data.email, data.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  async register(@Body() data: RegisterDto) {
    const user = await this.authService.register(data);

    if (!user) {
      throw new BadRequestException('Registration failed');
    }

    return user;
  }
}
