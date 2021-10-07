const db = require('../../data/dbConfig');
const Hobbit = require('./hobbits-model');

describe('Hobbit model', () => {
  //----------------------------------------------------------------------------//
  // jest.beforeAll() specifies a method that is executed once before the entire
  // test suite. You would use this to do any setup or initialization needed
  // before running the tests, but that also only need to be run once (as opposed
  // to before each test case).
  //----------------------------------------------------------------------------//
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
  
  describe('getAll()', () => {
    it('returns an array of hobbits', async () => {
      const hobbits = await Hobbit.getAll();

      expect(hobbits.length).toBe(4);

      hobbits.forEach(hobbit => {
        expect(hobbit).toHaveProperty('id');
        expect(hobbit).toHaveProperty('name');
      });
    });
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
      expect(await db('hobbits')).toHaveLength(5);
    });
  });

  describe('update()', () => {
    it('updates the hobbit', async () => {      
      await Hobbit.update(1, { name: 'sam 2' });
      
      const hobbit = await db('hobbits').where({ id: 1 }).first();

      expect(hobbit).toMatchObject({ name: 'sam 2' });
    });
  });

  describe('remove()', () => {
    it('removes the hobbit', async () => {
      await Hobbit.remove(1);

      expect(await db('hobbits').where({ id: 1 }).first()).toBeUndefined();
    });
  });
});