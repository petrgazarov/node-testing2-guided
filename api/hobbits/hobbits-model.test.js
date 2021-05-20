const Hobbit = require('./hobbits-model')

console.log(process.env.USER)
console.log(process.env.FOO)

describe('Hobbits', () => {

  describe('sanity', () => {

    test('Hobbit is defined', () => {
      expect(Hobbit).toBeDefined()
    })

    test('Hobbit is defined', () => {
      expect(process.env.NODE_ENV).toBe('testing')
    })
  })
})
