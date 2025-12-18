import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AdvanceController (e2e) - Punto A', () => {
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

  describe('GET /advance', () => {
    it('Debe existir el endpoint GET /advance', async () => {
      const res = await request(app.getHttpServer())
        .get('/advance')
        .query({ rut: 'temp123', codcarrera: 'CS' })
        .expect(200)
        .expect(res => {
          if(expect(Array.isArray(res.body))){
          }else{
            expect(res.body).toEqual(
              expect.objectContaining({
                success: expect.any(Boolean),
                message: expect.anything(),
                details: res.body.details !== undefined ? expect.anything() : undefined
              })
            )
          }
        })
    });
  });

});
