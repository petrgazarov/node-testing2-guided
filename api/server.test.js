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
    await db('hobbits').insert([{ name: 'sam' }, { name: 'frodo' }])
  })
  it('returns a list of hobbits', async () => {
    const res = await request(server).get('/hobbits')
    console.log(res.body)
    console.log(res.status)
    console.log(res.headers)

    expect(res.status).toBe(200)
    expect(res.body).toEqu
    // const res = request(server).post('/hobbits').send({ name: 'pippin' })
  })
})
