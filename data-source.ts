import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/users/user.entity';
import { Task } from './src/tasks/task.entity';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Task],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
});