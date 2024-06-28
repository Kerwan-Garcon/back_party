import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user'
  })
  email: string;
  @ApiProperty({
    example: 'password123',
    description: 'The password of the user'
  })
  password: string;
  @ApiProperty({
    example: 'name',
    description: 'The name of the user'
  })
  name: string;
  @ApiProperty({
    example: 25,
    description: 'The age of the user'
  })
  age: number;
  @ApiProperty({
    example: ['football', 'basketball'],
    description: 'The interests of the user'
  })
  interests: string[];
}
