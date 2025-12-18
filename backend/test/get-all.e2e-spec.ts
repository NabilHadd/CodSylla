import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import * as jwt from 'jsonwebtoken';

describe('GetAllController (e2e)', () => {
  let app: INestApplication;
  let testToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // JWT de prueba para endpoint protegido
    testToken = 'Bearer ' + jwt.sign(
      { rut: 'temp123', carreras: [{ codigo: 'CS', catalogo: '2025', nombre: 'Ingeniería' }] },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /get-all/disponibles', () => {
    it('Debe existir el endpoint GET /get-all/disponibles', async () => {
      const res = await request(app.getHttpServer())
        .get('/get-all/disponibles')
        .set('Authorization', testToken)
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      res.body.forEach(item => expect(typeof item).toBe('string'));
    });
  });

  describe('GET /get-all/semestre', () => {
    it('Debe existir el endpoint GET /get-all/semestre', async () => {
      const res = await request(app.getHttpServer())
        .get('/get-all/semestre')
        .expect(200);
    });
  });

  describe('GET /get-all/carreras', () => {
    it('Debe existir el endpoint GET /get-all/carreras', async () => {
      const res = await request(app.getHttpServer())
        .get('/get-all/carreras')
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      res.body.forEach(carrera => {
        expect(carrera).toEqual(
          expect.objectContaining({
            catalogo: expect.any(String),
            codigo: expect.any(String),
            nombre: expect.anything()
          })
        );
      });
    });
  });

});
