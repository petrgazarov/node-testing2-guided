const db = require('../../data/dbConfig.js');
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

  //----------------------------------------------------------------------------//
  // jest.beforeEach() specifies a method that is executed before each test. You
  // would use this to do any setup or initialization needed before *every*
  // test.
  //----------------------------------------------------------------------------//
  beforeEach(async () => {
    await db('hobbits').truncate();
  });

  //----------------------------------------------------------------------------//
  // Similar to jest.beforeEach() and jest.beforeAll(), jest also has their
  // equivalents that run *after* test cases: jest.afterEach() and jest.afterAll().
  //----------------------------------------------------------------------------//
  afterAll(async () => {
    await db.destroy();
  });

  describe('insert()', () => {
    it('creates a new hobbit', async () => {
      const newHobbit = await Hobbit.insert({ name: 'Frodo' });

      expect(newHobbit).toMatchObject({ name: 'Frodo' })
    });
  });

  describe('getAll()', () => {
    it('returns an empty array when there are no hobbits', async () => {
      const hobbits = await Hobbit.getAll();

      expect(hobbits).toEqual([]);
    });

    it('returns an array of hobbits when there are hobbits', async () => {
      await Hobbit.insert({ name: 'Frodo' });
      await Hobbit.insert({ name: 'Sam' });

      const hobbits = await Hobbit.getAll();

      expect(hobbits).toHaveLength(2);
      expect(hobbits[0]).toMatchObject({ name: 'Frodo' });
      expect(hobbits[1]).toMatchObject({ name: 'Sam' });
    });
  });

  describe('getById()', () => {
    it('returns the hobbit when the id exists in db', async () => {
      const { id: newHobbitId } = await Hobbit.insert({ name: 'Frodo' });

      const hobbit = await Hobbit.getById(newHobbitId);

      expect(hobbit).toMatchObject({ name: 'Frodo' });
    });

    it(`returns null when the id doesn't exist in db`, async () => {
      const hobbit = await Hobbit.getById(1);

      expect(hobbit).toBeUndefined();
    });
  });

  describe('update()', () => {
    it('updates an existing record', async () => {
      const { id: newHobbitId } = await Hobbit.insert({ name: 'Frodo' });

      const hobbit = await Hobbit.update(newHobbitId, { name: 'Frodo 1' });

      expect(hobbit).toMatchObject({ name: 'Frodo 1' });
    });
  });

  describe('remove()', () => {
    it('removes the record', async () => {
      const { id: newHobbitId } = await Hobbit.insert({ name: 'Frodo' });

      await Hobbit.remove(newHobbitId);

      expect(await Hobbit.getById(newHobbitId)).toBeUndefined();
    });
  });
});
