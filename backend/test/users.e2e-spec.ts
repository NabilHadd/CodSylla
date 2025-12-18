import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { error } from 'console';

type User = {
  rut: string,
  email: string,
  rol: string,
};

type Carrera = {
        codigo: string;
        catalogo: string;
        nombre: string;
    };

describe('UsersController (e2e) - Punto A', () => {
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

  describe('GET /users', () => {
    it('Debe existir el endpoint GET /users', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .expect(200);
    });
  });

	//error 500 debido a que no puede devolver null
  describe('GET /users/:rut', () => {
    it('Debe existir el endpoint GET /users/:rut', async () => {
      await request(app.getHttpServer())
        .get('/users/12345678')
        .expect(500);
    });
  });



	describe('POST /users', () => {
		it('Debe existir el endpoint POST /users', async () => {
			await request(app.getHttpServer())
				.post('/users')
				.send({
					user: { rut: '12345678', email: 'test@test.com', rol: 'estudiante' },
					carrera: { codigo: 'CS', catalogo: '2025', nombre: 'Ingeniería' }
				})
				.expect(201);
		});
	});


	//500
  describe('PATCH /users/:id', () => {
    it('Debe existir el endpoint PATCH /users/:id', async () => {
      await request(app.getHttpServer())
        .patch('/users/temp123') 
        .send({ email: 'nuevo@test.com' })
        .expect(500);
    });
  });

	//500
  describe('DELETE /users/:id', () => {
    it('Debe existir el endpoint DELETE /users/:id', async () => {
      await request(app.getHttpServer())
        .delete('/users/temp123')
        .expect(500);
    });
  });
});
