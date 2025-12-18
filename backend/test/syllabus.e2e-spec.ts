import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('SyllabusController (e2e) - Punto A', () => {
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

	describe('GET /syllabus', () => {
		it('Debe existir el endpoint GET /syllabus', async () => {
			const res = await request(app.getHttpServer())
				.get('/syllabus')
				.query({ code: 'CS101', catalog: '2025' })
				.expect(200);

			if (Array.isArray(res.body)) {
				expect(res.body).toBeInstanceOf(Array);
			} else if ('success' in res.body) {
				expect(res.body.success).toBeDefined();
				expect(res.body.message).toBeDefined();
			} else {
				throw new Error('Respuesta inesperada del endpoint /syllabus');
			}
		});
	});

});
