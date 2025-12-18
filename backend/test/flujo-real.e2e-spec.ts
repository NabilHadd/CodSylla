import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Carga mínima - 5 usuarios', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Crear 5 usuarios de prueba
    const usuarios = [
      { rut: 'user1', email: 'user1@test.com', rol: 'estudiante' },
      { rut: 'user2', email: 'user2@test.com', rol: 'estudiante' },
      { rut: 'user3', email: 'user3@test.com', rol: 'estudiante' },
      { rut: 'user4', email: 'user4@test.com', rol: 'estudiante' },
      { rut: 'user5', email: 'user5@test.com', rol: 'estudiante' },
    ];

    for (const u of usuarios) {
      await request(app.getHttpServer())
        .post('/users')
        .send({
          user: u,
          carrera: { codigo: 'CS', catalogo: '2025', nombre: 'Ingeniería' },
        })
        .expect(201);
    }
  });

  afterAll(async () => {

    await app.close();
  });

  it('Debe responder correctamente para 5 solicitudes concurrentes', async () => {
    const requests = Array.from({ length: 5 }).map((_, i) =>
      request(app.getHttpServer()).get('/users').expect(200)
    );

    await Promise.all(requests);
  });
});
