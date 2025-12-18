import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import * as jwt from 'jsonwebtoken';

describe('HistorialController (e2e) - Punto A', () => {
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
      { rut: 'temp123'},
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await app.close();
  });

  //devuelve 201 pero se rompe pq no existe en prisma el registro.
  describe('POST /historial/modificar-estado-ramos', () => {
    it('Debe existir el endpoint POST /historial/modificar-estado-ramos', async () => {
      await request(app.getHttpServer())
        .post('/historial/modificar-estado-ramos')
        .set('Authorization', testToken)
        .send({
          ramos: [
            { codigo_ramo: 'CS101', estado: 'aprobado' },
            { codigo_ramo: 'CS102', estado: 'pendiente' }
          ]
        })
        .expect(201);
    });
  });
});
