import { CreateUserInput } from '../dtos/user';
import { PaginationInput } from '../dtos/shared';
import { UserEntity } from '../types/user.types';

// A generic interface for paginated results we can reuse across any service
export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

const usersDb: UserEntity[] = [];

export class UserService {
  
  async createUser(input: CreateUserInput): Promise<UserEntity> {
    const newUser: UserEntity = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...input,
    };

    usersDb.push(newUser);
    return newUser;
  }

  async getUsers(pagination: PaginationInput): Promise<PaginatedResult<UserEntity>> {
    const { page, limit } = pagination;
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const slicedUsers = usersDb.slice(startIndex, endIndex);

    return {
      data: slicedUsers,
      page,
      limit,
      total: usersDb.length,
    };
  }
}