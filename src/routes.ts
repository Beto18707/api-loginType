import express from 'express';
import { register, login, refreshToken, getAllUsers } from './controllers';
import * as middleware from './middlewares';

const router = express.Router();

router.post('/register', middleware.validateUserInput, register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

router.get(
  '/admin-area',
  middleware.authenticateToken,
  middleware.authorizeRole('admin', 'admuser'),
  (req, res) => {
    res.json({ message: 'Bem-vindo à área de admin' });
  }
);

router.get(
  '/users',
  middleware.authenticateToken,
  middleware.authorizeRole('admin', 'admuser'),
  getAllUsers
);

export default router;
