const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

describe('server.js', () => {
  beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
  });

  beforeEach(async () => {
    await db('hobbits').truncate();
  });

  afterAll(async () => {
    await db.destroy();
  });

  test('Proper database env variable is set', () => {
    expect(process.env.DB_ENV).toEqual('testing');
  });

  describe('[GET] /', () => {
    it('returns in valid response', () => {
      return request(server)
        .get('/')
        .expect('Content-Type', /application\/json/)
        .expect(200, { api: 'up' });
    });
  });

  describe('[GET] /hobbits', () => {
    it('returns an array of hobbits', async () => {
      await db.seed.run();

      const res = await request(server).get('/hobbits');

      expect(res.body).toHaveLength(4);
      
      res.body.forEach(hobbit => {
        expect(hobbit).toHaveProperty('id');
        expect(hobbit).toHaveProperty('name');
      });
    });
  });
});