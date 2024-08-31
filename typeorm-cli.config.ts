import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import { Task } from './src/tasks/task.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'admin123',
  database: 'admin_database',
  entities: [User, Task],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  logging: process.env.NODE_ENV === 'test' ? false : ['error', 'schema'],
});

export default dataSource;