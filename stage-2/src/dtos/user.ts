
import { z } from 'zod';

export const UserCoreSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  age: z.number().min(18).optional(),
});

export const CreateUserDto = UserCoreSchema;
export const UpdateUserDto = UserCoreSchema.partial();

export type CreateUserInput = z.infer<typeof CreateUserDto>;
export type UpdateUserInput = z.infer<typeof UpdateUserDto>;