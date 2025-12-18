import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e) - Punto A', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('Debe existir el endpoint POST /auth/login', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@test.com',
          password: '123456'
        })
        .expect(201);

      expect(res.body).toBeDefined();
      if ('success' in res.body && res.body.success) {
        expect(res.body).toEqual(
          expect.objectContaining({
            success: true,
            admin: expect.any(Boolean),
            rol: expect.any(String),
            token: expect.any(String)
          })
        );
      } else if ('success' in res.body && !res.body.success && 'message' in res.body) {
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBeDefined();
      } else if ('success' in res.body && res.body.details) {
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBeDefined();
        expect(res.body.details).toBeDefined();
      } else {
        throw new Error('Respuesta inesperada del endpoint /auth/login');
      }
    });
  });

});
