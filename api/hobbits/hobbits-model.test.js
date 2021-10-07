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
    it('retrives hobbit by id if hobbit exists', async () => {
      const hobbit = await Hobbit.getById(1);

      expect(hobbit).toMatchObject({ name: 'sam' });
    });

    it('returns undefined if hobbit does not exist', async () => {
      const hobbit = await Hobbit.getById(5);

      expect(hobbit).toBeUndefined();
    });
  });

  describe('insert()', () => {
    it('creates a hobbit', async () => {
      const hobbit = await Hobbit.insert({ name: 'Frodo 2' });

      expect(hobbit).toMatchObject({ name: 'Frodo 2' });
    });
  });
});