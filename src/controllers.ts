import { Request, Response } from 'express';
import { registerUser, loginUser, refreshAccessToken } from './services';
import { getUsers } from './services';
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role } = req.body;
    if (!['user', 'admin', 'admuser'].includes(role)) {
      res.status(400).json({ message: 'Role inválido' });
      return;
    }
    await registerUser(name, email, password, role);
    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const tokens = await loginUser(email, password);
    res.json(tokens); // envia accessToken e refreshToken
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token é obrigatório' });
      return;
    }

    const accessToken = await refreshAccessToken(refreshToken);
    res.json({ accessToken });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
}

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
}