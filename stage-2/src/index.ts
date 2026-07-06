import { Router } from 'express';
import { validate } from './middleware/validate';
import { CreateUserDto, CreateUserInput } from './dtos/user';
import { PaginationInput, PaginationSchema } from './dtos/shared';
import { z } from 'zod';
import { UserService } from './services/user.services';

const router = Router();

const GetUsersValidation = z.object({ query: PaginationSchema });
const CreateUserValidation = z.object({ body: CreateUserDto });

const userService = new UserService()

// Routes
router.get('/', validate(GetUsersValidation), async (req, res) => {
  try {
    const queryData = req.query as unknown as PaginationInput;
    
    const result = await userService.getUsers(queryData);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/', validate(CreateUserValidation), async (req, res) => {
  try {
    const bodyData = req.body as CreateUserInput;
    
    const newUser = await userService.createUser(bodyData);
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create user' });
  }
});

export default router;