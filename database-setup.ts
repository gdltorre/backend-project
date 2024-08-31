import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import { Task } from './src/tasks/task.entity';

async function setupDatabase() {
  try {
    // Initialize the DataSource with the configuration
    const dataSource = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin123',
      database: 'admin_database',
      entities: [User, Task],
      synchronize: false,
    });

    // Initialize the data source to establish the connection
    await dataSource.initialize();
    console.log('Database setup complete');

    // Properly close the connection
    await dataSource.destroy();
  } catch (error) {
    console.error('Database setup failed:', error);
  }
}

setupDatabase();
