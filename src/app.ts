import cors from 'cors';
import express, { Express } from 'express';

import router from './routes';

const app: Express = express();

app.use(cors());

app.use(express.json());

app.use('/', router);

export default app;
