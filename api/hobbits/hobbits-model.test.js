const Hobbit = require('./hobbits-model');
const db = require('../../data/dbConfig');

describe('Hobbit model', () => {
  // 1. migrate
  // 2. seed
  // 3. cleanup after test

  beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
  });

  beforeEach(async () => {
    await db.seed.run();
  });

  describe('getById()', () => {
    it('retrives hobbit by id', async () => {
      const hobbit = await Hobbit.getById(1);

      expect(hobbit).toMatchObject({ name: 'sam' });
    });
  });
});