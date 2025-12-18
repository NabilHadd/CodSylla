import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Carga mínima - 5 usuarios concurrentes', () => {
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

  it('Debe manejar 5 solicitudes concurrentes al endpoint GET /users', async () => {
    const requests = Array.from({ length: 5 }, () =>
      Promise.resolve(request(app.getHttpServer()).get('/users').expect(200))
    );

    await Promise.all(requests);
  });
});
