import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { setupTestContainer } from './testcontainers-config';
import { TaskStatus } from '../src/tasks/dto/tasks.dto';
import { DataSource, getConnection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';
import { Task } from '../src/tasks/task.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let userId: number;
  let taskId: number;
  let dataSource: DataSource;

  beforeAll(async () => {
    //const container = await setupTestContainer();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Get the DataSource instance from the module
    dataSource = moduleFixture.get<DataSource>(DataSource);
    
    await app.init();
  }, 60000);

  beforeEach(async () => {
    // Clear the database tables
    await dataSource.query('DELETE FROM tasks');
    await dataSource.query('DELETE FROM users');
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('Authentication', () => {
    it('should register a new user and set JWT token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'testuser', password: 'testpass', name: 'Test User', email: 'test@example.com' })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      jwtToken = response.body.access_token;
    });

    it('should authenticate user and return JWT token', async () => {
      // First, register a user
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'testuser', password: 'testpass', name: 'Test User', email: 'test@example.com' })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'testuser', password: 'testpass' })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      jwtToken = response.body.access_token;
    });
  });

  describe('User Management', () => {
    beforeEach(async () => {
      // Create a test user and get JWT token
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'testuser', password: 'testpass', name: 'Test User', email: 'test@example.com' })
        .expect(201);

      jwtToken = response.body.access_token;
    });

    it('should retrieve user details by ID', async () => {
      const user = await dataSource.getRepository(User).findOne({ where: { username: 'testuser' } });
      expect(user).not.toBeNull();
      userId = user.id;

      return request(app.getHttpServer())
        .get(`/auth/users/${userId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('id', userId);
          expect(res.body).toHaveProperty('username', 'testuser');
          expect(res.body).toHaveProperty('name', 'Test User');
        });
    });

    it('should retrieve all users', async () => {
      return request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('Task Management', () => {
    beforeEach(async () => {
      // Create a test user and get JWT token
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'testuser', password: 'testpass', name: 'Test User', email: 'test@example.com' })
        .expect(201);

      jwtToken = response.body.access_token;

      // Create a test task
      const taskResponse = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ title: 'Test Task', description: 'This is a test task', status: TaskStatus.TODO })
        .expect(201);

      taskId = taskResponse.body.id;
    });

    it('should create a new task', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ title: 'Another Task', description: 'This is another test task', status: TaskStatus.TODO })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Another Task');
    });

    it('should retrieve all tasks for the authenticated user', async () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id', taskId);
        });
    });

    it('should retrieve a specific task by ID', async () => {
      return request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('id', taskId);
          expect(res.body).toHaveProperty('title', 'Test Task');
          expect(res.body).toHaveProperty('status', TaskStatus.TODO);
        });
    });

    it('should update an existing task', async () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ title: 'Updated Task', status: TaskStatus.IN_PROGRESS })
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('id', taskId);
          expect(res.body).toHaveProperty('title', 'Updated Task');
          expect(res.body).toHaveProperty('status', TaskStatus.IN_PROGRESS);
        });
    });

    it('should delete a task', async () => {
      await request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      // Verify task is deleted
      return request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });
  });

  describe('Error Handling', () => {
    it('should return 401 Unauthorized when accessing protected route without JWT', async () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(401);
    });

    it('should return 400 Bad Request when creating task with invalid data', async () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ title: '' }) // Missing required fields
        .expect(400);
    });

    it('should return 404 Not Found when attempting to access non-existent task', async () => {
      return request(app.getHttpServer())
        .get('/tasks/99999')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });
  });
});