import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'supersecret',
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mydb',
  },
  bcryptSaltRounds: 10,
  rateLimitWindowMs: 15 * 60 * 1000, // 15 min
  rateLimitMaxRequests: 100, // max 100 requests por IP na janela
};
