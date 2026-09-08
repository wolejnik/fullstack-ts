import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.passwordHash,
    );

    return isPasswordValid ? user : null;
  }

  async register(email: string, password: string): Promise<AuthTokens> {
    const user = await this.usersService.createUser(email, password);
    return this.login(user);
  }

  async login(user: Pick<User, 'id' | 'email' | 'role'>): Promise<AuthTokens> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    await this.usersService.setCurrentRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<AuthTokens | null> {
    const user = await this.usersService.getUserIfRefreshTokenMatches(refreshToken, userId);
    if (!user) return null;

    return this.login(user);
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.removeRefreshToken(userId);
  }
}
