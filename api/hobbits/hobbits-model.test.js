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

  describe('getAll()', () => {
    it('returns an empty array when there are no hobbits', async () => {
      const hobbits = await Hobbit.getAll();

      expect(hobbits).toEqual([]);
    });

    it('returns an array of hobbits when they exist', async () => {
      await db.seed.run();

      const hobbits = await Hobbit.getAll();

      expect(hobbits.length).toBe(4);

      hobbits.forEach(hobbit => {
        expect(hobbit).toHaveProperty('id');
        expect(hobbit).toHaveProperty('name');
      });
    });
  });

  describe('insert()', () => {
    it('creates a new hobbit', async () => {
      const hobbit = await Hobbit.insert({ name: 'Frodo' });

      expect(hobbit).toMatchObject({ name: 'Frodo' });
    });
  });

  describe('getById()', () => {
    it('returns the hobbit if it exists', async () => {
      const { id } = await Hobbit.insert({ name: 'Frodo' });

      const hobbit = await Hobbit.getById(id);

      expect(hobbit).toMatchObject({ name: 'Frodo' });
    });

    it("returns undefined when the hobbit doesn't exist", async () => {
      const result = await Hobbit.getById('12345');

      expect(result).toBeUndefined();
    });
  });

  describe('update()', () => {
    it('updates an existing record', async () => {
      const { id } = await Hobbit.insert({ name: 'Frodo' });
      
      await Hobbit.update(id, { name: 'Frodo 1' });
      
      const hobbit = await Hobbit.getById(id);

      expect(hobbit).toMatchObject({ name: 'Frodo 1' });
    });
  });

  describe('remove()', () => {
    it('removes the hobbit', async () => {
      const { id } = await Hobbit.insert({ name: 'Frodo' });

      await Hobbit.remove(id);

      expect(await Hobbit.getById(id)).toBeUndefined();
    });
  });
});