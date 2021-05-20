const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server')

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

describe('[GET] /hobbits', () => {
  beforeEach(async () => {
    await db('hobbits').insert({ name: 'sam' }, { name: 'frodo' })
  })
  it('returns a list of hobbits', async () => {

  })
})
