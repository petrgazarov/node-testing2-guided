const db = require('../../data/dbConfig');
const Hobbit = require('./hobbits-model');

describe('Hobbit model', () => {
  // 1. Before all the tests, migrate if necessary
  // 2. Before each test, clean up all records from db

  beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
  });

  beforeEach(async () => {
    await db('hobbits').truncate();
  });

  describe('getAll()', () => {
    it('returns an empty array when there are no hobbits', async () => {
      const hobbits = await Hobbit.getAll();

      expect(hobbits).toEqual([]);
    });
  });

  describe('insert()', () => {
    it('creates a new hobbit', async () => {
      const hobbit = await Hobbit.insert({ name: 'Frodo' });

      expect(hobbit).toMatchObject({ name: 'Frodo' });
    });
  });

  describe('getById', () => {
    it('returns the hobbit if it exists', async () => {
      const { id } = await Hobbit.insert({ name: 'Frodo' });

      const hobbit = await Hobbit.getById(id);

      expect(hobbit).toMatchObject({ name: 'Frodo' });
    });

    it.skip("returns undefined when the hobbit doesn't exist", () => {

    });
  });
});