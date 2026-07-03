import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { UsersModule } from '@/users/users.module';
import { createTestServer } from './utils';
import { CreateUserDto } from '@/users/dtos/create-user.dto';

const validUserPayload = (): CreateUserDto => ({
  username: 'Test',
  email: `new-user-${Date.now()}@example.com`,
  password: 'Password_123!',
});

describe('UsersController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createTestServer([UsersModule]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('returns 201 when creates a new account', async () => {
      const payload = validUserPayload();

      const res = await request(app.getHttpServer())
        .post('/users')
        .send(payload)
        .expect(201);

      console.log(res.body);

      expect(res.body).toMatchObject({
        id: expect.any(String),
        username: payload.username,
        email: payload.email,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      expect(res.body).not.toHaveProperty('password');
    });

    it('returns 400 when DTO field is missing', async () => {
      const payload = validUserPayload();

      await request(app.getHttpServer())
        .post('/users')
        .send({
          email: payload.email,
          password: payload.password,
        })
        .expect(400);
    });

    it('returns 400 when password is not strong enough', async () => {
      const payload = validUserPayload();

      await request(app.getHttpServer())
        .post('/users')
        .send({
          email: payload.email,
          username: payload.username,
          password: 'not-strong-password',
        })
        .expect(400);
    });

    it('returns 409 when user account already exists', async () => {
      const payload = validUserPayload();

      await request(app.getHttpServer())
        .post('/users')
        .send(payload)
        .expect(201);

      // attempt to create a new account with the same credentials
      await request(app.getHttpServer())
        .post('/users')
        .send(payload)
        .expect(409);
    });
  });
});
