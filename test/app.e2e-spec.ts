import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { setupTestContainer } from './testcontainers-config';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const container = await setupTestContainer();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Register a user
    await request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'testuser', password: 'testpass', name: 'Test User', email: 'test@example.com' })
        .expect(201);

    // Login and get JWT token
    const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'testuser', password: 'testpass' })
        .expect(200);

    jwtToken = loginResponse.body.access_token;
  }, 60000);

  it('/tasks (POST)', () => {
    return request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ title: 'Test Task', description: 'This is a test task', status: 'TODO' })
        .expect(201);
  });

  it('/tasks (GET)', () => {
    return request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBeGreaterThan(0);
        });
  });

  // Add more tests for other task endpoints (GET /:id, PATCH /:id, DELETE /:id)

  afterAll(async () => {
    await app.close();
  });
});