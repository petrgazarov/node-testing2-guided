const Hobbit = require('./hobbits-model')

// console.log(process.env.USER)
// console.log(process.env.FOO)

beforeAll(async () => {})
afterAll(async () => {})
beforeEach(async () => {})
afterEach(async () => {})

describe('Hobbits', () => {

  describe('sanity', () => {

    test('Hobbit is defined', () => {
      expect(Hobbit).toBeDefined()
    })

    test('Environment is correct', () => {
      expect(process.env.NODE_ENV).toBe('testing')
    })
  })
})
