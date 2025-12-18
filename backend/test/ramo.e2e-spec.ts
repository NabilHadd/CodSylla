import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import * as jwt from 'jsonwebtoken';

const testToken = 'Bearer ' + jwt.sign(
  { rut: 'temp123', email: 'temp@test.com', roles: ['estudiante'] },
  process.env.JWT_SECRET || 'secret', // la misma clave que usa tu JwtModule
  { expiresIn: '1h' }
);


describe('RamoController (e2e) - Punto A', () => {
  let app: INestApplication;
  const testToken = 'Bearer ' + jwt.sign(
    { rut: 'temp123', email: 'temp@test.com', roles: ['estudiante'], carreras: [{ codigo_syll: '12', catalogo: '12',}]},
    process.env.JWT_SECRET || 'secreto',
    { expiresIn: '1h' }
  );

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

	describe('GET /ramo/ramos-actuales', () => {
		it('Debe existir el endpoint GET /ramo/ramos-actuales', async () => {
			const res = await request(app.getHttpServer())
				.get('/ramo/ramos-actuales')
				.set('Authorization', testToken)
				.expect(200);

			expect(res.body).toBeInstanceOf(Array);
			res.body.forEach(ramo => {
				expect(ramo).toEqual(
					expect.objectContaining({
						nombre: expect.any(String),
						codigo: expect.any(String),
						estado: expect.any(String)
					})
				);
			});
		});
	});

	describe('GET /ramo/ramos-pendientes', () => {
		it('Debe existir el endpoint GET /ramo/ramos-pendientes', async () => {
			const res = await request(app.getHttpServer())
				.get('/ramo/ramos-pendientes')
				.set('Authorization', testToken)
				.expect(200);

			expect(res.body).toBeInstanceOf(Array);
			res.body.forEach(ramo => {
				expect(ramo).toEqual(
					expect.objectContaining({
						codigo: expect.any(String),
						nombre: expect.any(String),
						creditos: expect.any(Number),
						nivel: expect.anything()
					})
				);
			});
		});
	});

});
