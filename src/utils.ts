import { User } from './models';
import { v4 as uuidv4 } from 'uuid';

export function generateId(): string {
  return uuidv4();
}

export function sanitizeUser(user: User) {
  const { password, ...safeUser } = user;
  return safeUser;
}

const validRoles = ['user', 'admin', 'admuser'];
export function isValidRole(role: string): boolean {
  return validRoles.includes(role);
}

export function log(message: string) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}
 
export function formatErrorMessage(msg: string) {
  return { error: true, message: msg };
}
