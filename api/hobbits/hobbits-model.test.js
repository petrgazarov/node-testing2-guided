const Hobbit = require('./hobbits-model')

describe('Hobbits', () => {

  describe('sanity', () => {

    test('Hobbit is defined', () => {
      expect(Hobbit).toBeDefined()
      expect(process.env.NODE_ENV).toBe('testing')
    })
  })
})
