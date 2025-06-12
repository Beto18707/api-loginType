import express from 'express';
import router from './routes';
import { config } from './config';

const app = express();

app.use(express.json());

app.use('/api', router);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro no servidor' });
});

app.listen(config.port, () => {
  console.log(`Servidor rodando na porta ${config.port}`);
});
