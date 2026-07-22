import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  username: string;
  password: string;
}

@Injectable()
export class UsersService {
  private users: User[] = []; // replace with real DB later

  async create(username: string, hashedPassword: string): Promise<User> {
    const user = { id: Date.now(), username, password: hashedPassword };
    this.users.push(user);
    return user;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.users.find((u) => u.username === username);
  }
}