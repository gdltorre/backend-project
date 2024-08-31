const { DataSource } = require('typeorm');
const { User } = require('../src/users/user.entity');
const { Task } = require('../src/tasks/task.entity');
require('dotenv').config();

module.exports = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Task],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
});