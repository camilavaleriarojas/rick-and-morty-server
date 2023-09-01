import express from 'express';
import userRouter from './users';
import charactersRouter from './characters';

const router = express.Router();

router.use('/user', userRouter);
router.use('/api/characters', charactersRouter);

export default router;
