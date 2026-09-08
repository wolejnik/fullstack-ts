import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'jan@example.com' })
  @IsEmail({}, { message: 'Podaj poprawny adres email' })
  email: string;

  @ApiProperty({ example: 'haslo123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Hasło musi mieć minimum 6 znaków' })
  password: string;
}