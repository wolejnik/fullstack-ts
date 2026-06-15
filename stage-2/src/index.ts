import { Router } from 'express';
import { validate } from './middleware/validate';
import { CreateUserDto } from './dtos/user';
import { PaginationSchema } from './dtos/shared';
import { z } from 'zod';

const router = Router();

const GetUsersValidation = z.object({ query: PaginationSchema });
const CreateUserValidation = z.object({ body: CreateUserDto });

// Routes
router.get('/', validate(GetUsersValidation), (req, res) => {
  const { page, limit } = req.query; 
  res.send(`Fetching page ${page} with limit ${limit}`);
});

router.post('/', validate(CreateUserValidation), (req, res) => {
  const newUser = req.body; 
  res.status(201).json(newUser);
});

export default router;