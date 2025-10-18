import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '',
  })
  name: string;
  @IsEmail()
  @ApiProperty({
    example: '',
  })
  email: string;
  @MinLength(6)
  @ApiProperty({
    example: '',
  })
  password: string;
}
