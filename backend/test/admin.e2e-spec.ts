import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import * as jwt from 'jsonwebtoken';

describe('AdminController (e2e) - Punto A', () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // JWT de prueba para usuario admin
    adminToken = 'Bearer ' + jwt.sign(
      { rut: 'admin123', isAdmin: true },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await app.close();
  });
  
  describe('GET /admin/audit-log', () => {
    it('Debe existir el endpoint GET /admin/audit-log', async () => {
      const res = await request(app.getHttpServer())
        .get('/admin/audit-log')
        .set('Authorization', adminToken)
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      if (res.body.length > 0) {
        expect(res.body[0]).toEqual(
          expect.objectContaining({
            usuario: expect.objectContaining({
              rut: expect.any(String),
              email: expect.any(String),
              rol: expect.any(String)
            }),
            fecha: expect.any(String),
            rut_usuario: expect.any(String),
            accion: expect.anything()
          })
        );
      }
    });
  });

  describe('GET /admin/ramos', () => {
    it('Debe existir el endpoint GET /admin/ramos', async () => {
      const res = await request(app.getHttpServer())
        .get('/admin/ramos')
        .set('Authorization', adminToken)
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      if (res.body.length > 0) {
        expect(res.body[0]).toEqual(
          expect.objectContaining({
            codigo: expect.any(String),
            nombre: expect.any(String),
            creditos: expect.any(Number),
            nivel: expect.anything()
          })
        );
      }
    });
  });

  describe('POST /admin/audit-ramos', () => {
    it('Debe existir el endpoint POST /admin/audit-ramos', async () => {
      const res = await request(app.getHttpServer())
        .post('/admin/audit-ramos')
        .send({ semestre: '1' })
        .expect(201);

      expect(res.body).toBeInstanceOf(Array);
      if (res.body.length > 0) {
        expect(res.body[0]).toEqual(
          expect.objectContaining({
            codigo_ramo: expect.any(String),
            nombre: expect.any(String),
            count: expect.any(Number),
            carrera: expect.objectContaining({
              catalogo: expect.any(String),
              codigo: expect.any(String),
              nombre: expect.anything()
            })
          })
        );
      }
    });
  });

});
