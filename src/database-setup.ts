import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Task } from './tasks/task.entity';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function runMigrations() {
    const app = await NestFactory.create(AppModule);
    // Initialize the DataSource with the configuration
    const dataSource = app.get(DataSource);
    try {
        await dataSource.runMigrations();
        console.log('Migrations completed successfully');
    } 
    catch (error) {
        console.error('Migration failed:', error);
    } 
    finally {
        await app.close();
    }
}
runMigrations();
