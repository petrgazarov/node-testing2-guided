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
    it('returns the hobbit', async () => {
      const res = await request(server).get('/hobbits/1').expect(200);

      expect(res.body).toMatchObject({ name: 'sam' });
    });
  });
});