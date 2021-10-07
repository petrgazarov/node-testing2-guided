const request = require('supertest');
const db = require('../data/dbConfig');
const server = require('./server.js');

describe('server.js', () => {
  beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
  });

  beforeEach(async () => {
    await db.seed.run();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('[GET] /hobbits/:id', () => {
    // Happy path
    it('returns the hobbit if it exists', async () => {
      const res = await request(server).get('/hobbits/1').expect(200);

      expect(res.body).toMatchObject({ name: 'sam' });
    });

    // Sad path
    it('returns 404 if the hobbit does not exist', () => {
      return request(server).get('/hobbits/123').expect(404);
    });
  });
});