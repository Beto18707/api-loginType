import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User, findUserByEmail, createUser, updateRefreshToken, findUserById } from './models';
import { config } from './config';
import { pool } from './models';
const accessTokenExpiry = '15m';
const refreshTokenExpiry = '7d';

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: 'user' | 'admin' | 'admuser'
): Promise<void> {
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds);

  const user: User = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    role,
  };

  await createUser(user);
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const accessToken = jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    config.jwtSecret,
    { expiresIn: accessTokenExpiry }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    config.jwtSecret,
    { expiresIn: refreshTokenExpiry }
  );

  await updateRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken };
}

export async function refreshAccessToken(token: string): Promise<string> {
  try {
    const payload = jwt.verify(token, config.jwtSecret) as { id: string };
    const user = await findUserById(payload.id);
    if (!user || user.refreshToken !== token) throw new Error('Refresh token inválido');

    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      config.jwtSecret,
      { expiresIn: accessTokenExpiry }
    );

    return newAccessToken;
  } catch {
    throw new Error('Refresh token inválido');
  }
}

export async function getUsers(): Promise<Partial<User>[]> {
  const [rows] = await pool.query('SELECT id, name, email, role FROM users');
  return rows as Partial<User>[]; // Retorna sem a senha
}
