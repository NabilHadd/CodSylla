import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('PrintController (e2e) - Punto A', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /print/pdf', () => {
    it('Debe existir el endpoint POST /print/pdf', async () => {
      const res = await request(app.getHttpServer())
        .post('/print/pdf')
        .send({ html: '<h1>Prueba PDF</h1>' })
        .expect('Content-Type', /pdf/)
        .expect(201);

      expect(res.body).toBeDefined();
    });
  });
});
