import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Rejestracja nowego użytkownika' })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @ApiOperation({ summary: 'Logowanie — email + hasło' })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(LocalStrategy)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@CurrentUser() user: User, @Body() _dto: LoginDto) {
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Wymiana refresh tokena na nową parę tokenów' })
  @ApiBearerAuth()
  @UseGuards(JwtRefreshStrategy)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@CurrentUser() user: { userId: string; refreshToken: string }) {
    const tokens = await this.authService.refreshTokens(user.userId, user.refreshToken);
    if (!tokens) {
      throw new UnauthorizedException('Nieprawidłowy refresh token');
    }
    return tokens;
  }

  @ApiOperation({ summary: 'Wylogowanie — unieważnia refresh token' })
  @ApiBearerAuth()
  @UseGuards(JwtStrategy)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@CurrentUser() user: { userId: string }) {
    await this.authService.logout(user.userId);
    return { message: 'Wylogowano pomyślnie' };
  }

  @ApiOperation({ summary: 'Dane aktualnie zalogowanego użytkownika' })
  @ApiBearerAuth()
  @UseGuards(JwtStrategy)
  @Get('me')
  async me(@CurrentUser() user: { userId: string; email: string; role: string }) {
    return user;
  }

  @ApiOperation({ summary: '[ADMIN] Trasa dostępna tylko dla roli admin' })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtStrategy, RolesGuard)
  @Get('admin/secret')
  async adminOnly(@CurrentUser() user: { userId: string; role: string }) {
    return {
      message: 'Widzisz to tylko dlatego, że jesteś adminem',
      requestedBy: user,
    };
  }
}