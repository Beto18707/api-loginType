import mysql from 'mysql2/promise';
import { config } from './config';

export const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'admuser';
  refreshToken?: string | null;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return (rows as User[])[0] || null;
}

export async function findUserById(id: string): Promise<User | null> {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return (rows as User[])[0] || null;
}

export async function createUser(user: User): Promise<void> {
  const sql = 'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)';
  await pool.query(sql, [user.id, user.name, user.email, user.password, user.role]);
}

export async function updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
  const sql = 'UPDATE users SET refreshToken = ? WHERE id = ?';
  await pool.query(sql, [refreshToken, userId]);
}
