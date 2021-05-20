const Hobbit = require('./hobbits-model')
const db = require('../../data/dbConfig')

// console.log(process.env.USER)
// console.log(process.env.FOO)

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('hobbits').truncate()
})
afterAll(async () => {
  await db.destroy()
})

describe('Hobbits', () => {

  describe('sanity', () => {
    test('Hobbit is defined', () => {
      expect(Hobbit).toBeDefined()
    })
    test('Environment is correct', () => {
      expect(process.env.DB_ENV).toBe('testing')
    })
  })

  describe('getAll()', () => {
    beforeEach(async () => {
      await db('hobbits').insert({ name: 'sam' })
    })
    it('resolves to list of hobbits', async () => {
      let hobbits = await Hobbit.getAll()
      expect(hobbits).toHaveLength(1)
    })
    it('does something', () => {

    })
    it('does something', () => {

    })
  })
})
