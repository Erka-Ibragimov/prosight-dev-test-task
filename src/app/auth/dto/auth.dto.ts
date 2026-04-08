import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'User login to authenticate',
    example: 'admin',
  })
  @IsString()
  login!: string;
}

export class AuthResponseDto {
  @ApiProperty({
    type: String,
    description: 'JWT bearer token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;
}
