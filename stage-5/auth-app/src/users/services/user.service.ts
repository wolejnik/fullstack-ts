import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async createUser(email: string, plainPassword: string): Promise<User> {
    const existing = await this.findByEmail(email);
    if (existing) {
      throw new ConflictException('Użytkownik z tym adresem email już istnieje');
    }

    const passwordHash = await bcrypt.hash(plainPassword, 10);
    const user = this.usersRepository.create({ email, passwordHash });
    return this.usersRepository.save(user);
  }

  async validatePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  async setCurrentRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, { hashedRefreshToken });
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: string,
  ): Promise<User | null> {
    const user = await this.findById(userId);
    if (!user?.hashedRefreshToken) return null;

    const isMatching = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    return isMatching ? user : null;
  }

  async removeRefreshToken(userId: string): Promise<void> {
    await this.usersRepository.update(userId, { hashedRefreshToken: null });
  }
}
