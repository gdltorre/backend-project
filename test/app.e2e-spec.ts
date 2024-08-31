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
    //dataSource = moduleFixture.get<DataSource>(DataSource);
    
    await app.init();
  }, 60000);

  afterEach(async () => {
    // Clean up the database after each test using DataSource
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    }
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('user authentication', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'testuser', password: 'testpass', name: 'Test User', email: 'test@example.com' })
        .expect(201);
  
      expect(response.body).toHaveProperty('access_token');
      jwtToken = response.body.access_token;
      console.log('JWT Token after registration:', jwtToken);
    });

    it('should authenticate user and return JWT token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'testuser', password: 'testpass' })
        .expect(200);

      console.log('Login response:', response.body);
      
      expect(response.body).toHaveProperty('access_token');
      jwtToken = response.body.access_token;
      console.log('JWT Token after login:', jwtToken); 
    });

    it('should retrieve user details by ID via GET /auth/users/:id', async () => {
      return request(app.getHttpServer())
        .get(`/auth/users/${userId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('id', userId);
          expect(res.body).toHaveProperty('username', 'testuser');
          expect(res.body).toHaveProperty('name', 'Test User');
          //expect(res.body).toHaveProperty('email', 'test@example.com');
        });
    });

    it('should retrieve all users via GET /auth/users', async () => {
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

  describe('Task Management Operations', () => {
    it('should create a new task', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ title: 'Test Task', description: 'This is a test task', status: TaskStatus.TODO })
        .expect(201);
  
      expect(response.body).toHaveProperty('id');
      taskId = response.body.id;
    });

    it('should retrieve all tasks for the authenticated user via GET /tasks', async () => {
      console.log('Using JWT Token:', jwtToken); // Log the token before use
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

    it('should retrieve a specific task by ID via GET /tasks/:id', async () => {
      console.log('Using JWT Token:', jwtToken); // Log the token before use
      return request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('id', taskId);
          expect(res.body).toHaveProperty('title', 'Test Task');
          expect(res.body).toHaveProperty('description', 'This is a test task');
          expect(res.body).toHaveProperty('status', TaskStatus.TODO);
        });
    });

    it('should update an existing task via PATCH /tasks/:id', async () => {
      console.log('Using JWT Token:', jwtToken); // Log the token before use
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

    it('should delete a task via DELETE /tasks/:id', async () => {
      console.log('Using JWT Token:', jwtToken); // Log the token before use
      await request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      // Verify task is deleted by attempting to retrieve it
      return request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });
  });

  describe('Error Handling and Edge Cases', () => {
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
      console.log('Using JWT Token:', jwtToken); // Log the token before use
      return request(app.getHttpServer())
        .get('/tasks/99999')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });
  });
});