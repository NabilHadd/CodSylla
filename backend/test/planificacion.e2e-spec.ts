import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import * as jwt from 'jsonwebtoken';

describe('PlanificationController (e2e) - Punto A', () => {
  let app: INestApplication;
  let testToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Generar JWT de prueba
    testToken = 'Bearer ' + jwt.sign(
      { rut: 'temp123', carreras: [{ codigo: 'CS', catalogo: '2025', nombre: 'Ingeniería' }] },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

  });
  

  afterAll(async () => {
    await app.close();
  });

  describe('POST /planification/generar', () => {
    it('POST /planification/generar', async () => {
      await request(app.getHttpServer())
        .post('/planification/generar')
        .set('Authorization', testToken)
        .send({
          nombre: 'Plan prueba',
          maxCredits: 25,
          postponed: [],
          priority: [],
          reprobed: [],
        })
        .expect(201);
    });
  });

  //500
  describe('GET /planification/obtener/:rank', () => {
    it('Debe existir el endpoint GET /planification/obtener/:rank', async () => {
      await request(app.getHttpServer())
        .get('/planification/obtener/1')
        .set('Authorization', testToken)
        .expect(500);
    });
  });

  describe('GET /planification/obtener-todo', () => {
    it('Debe existir el endpoint GET /planification/obtener-todo', async () => {
      await request(app.getHttpServer())
        .get('/planification/obtener-todo')
        .set('Authorization', testToken)
        .expect(200);
    });
  });


  //500
  describe('POST /planification/actualizar-ranking', () => {
    it('Debe existir el endpoint POST /planification/actualizar-ranking', async () => {
      await request(app.getHttpServer())
        .post('/planification/actualizar-ranking')
        .set('Authorization', testToken)
        .send({ planes: [{ rank: 1, nombre: 'Plan prueba', fecha: new Date()}] })
        .expect(500);
    });
  });

  describe('DELETE /planification/eliminar-plan', () => {
    it('Debe existir el endpoint DELETE /planification/eliminar-plan', async () => {
      await request(app.getHttpServer())
        .delete('/planification/eliminar-plan')
        .set('Authorization', testToken)
        .send({ fecha: '2025-01-01', ranking: 1 })
        .expect(200);
    });
  });

  //500
  describe('GET /planification/obtener-nombre/:rank', () => {
    it('Debe existir el endpoint GET /planification/obtener-nombre/:rank', async () => {
      await request(app.getHttpServer())
        .get('/planification/obtener-nombre/1')
        .set('Authorization', testToken)
        .expect(500);
    });
  });
});
