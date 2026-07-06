import { z } from 'zod';
import { UserCoreSchema } from '../dtos/user';
import { BaseEntitySchema } from '../dtos/shared';

export const UserEntitySchema = BaseEntitySchema.merge(UserCoreSchema);
export type UserEntity = z.infer<typeof UserEntitySchema>;