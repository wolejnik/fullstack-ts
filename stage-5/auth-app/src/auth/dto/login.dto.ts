import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'jan@example.com' })
  @IsEmail({}, { message: 'Podaj poprawny adres email' })
  email: string;

  @ApiProperty({ example: 'haslo123' })
  @IsString()
  password: string;
}