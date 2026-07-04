import { INestApplication } from '@nestjs/common';
import { createTestServer, validUserPayload } from './utils';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthModule } from '@/auth/auth.module';

const payload = validUserPayload();

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createTestServer([AuthModule]);

    await request(app.getHttpServer()).post('/users').send(payload).expect(201);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/POST /auth/tokens', () => {
    it('returns 201 with an access token for valid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/tokens')
        .send({
          email: payload.email,
          password: payload.password,
        })
        .expect(201);

      expect(res.body).not.toHaveProperty('username');
      expect(res.body).not.toHaveProperty('email');
      expect(res.body).not.toHaveProperty('password');
      expect(res.body.accessToken).toBeDefined();
      expect(typeof res.body.accessToken).toBe('string');
    });

    it('returns 400 when missing fields', async () => {
      await request(app.getHttpServer()).post('/auth/tokens').expect(400);
    });

    it('returns 400 when missing password field', async () => {
      await request(app.getHttpServer())
        .post('/auth/tokens')
        .send({ email: payload.email })
        .expect(400);
    });
  });
});
