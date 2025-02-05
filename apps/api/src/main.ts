import dotenv from 'dotenv';
import express from 'express';
import * as path from 'path';
import connectDB from './utils/db/database-connection';
import authRoutes from './web-services/auth/auth.routes';
import taskRoutes from './web-services/task/task.routes';

dotenv.config({ path: path.join(__dirname, './../.env') });

const app = express();

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const port = process.env.API_PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
