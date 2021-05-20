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
    it('resolves to list of hobbits', async () => {
      const hobbits = await Hobbit.getAll()
      
    })
    it('does something', () => {

    })
    it('does something', () => {

    })
  })
})
