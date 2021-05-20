const Hobbit = require('./hobbits-model')
const db = require('../../data/dbConfig')

// console.log(process.env.USER)
// console.log(process.env.FOO)

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
afterAll(() => {
  // here
})
beforeEach(() => {
  // here
})
afterEach(() => {
  // here
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
})
