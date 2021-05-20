const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server')

const listOfHobbits = [{ name: 'sam' }, { name: 'frodo' }]

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('hobbits').truncate()
})
afterAll(async () => {
  // await db.destroy() 
})

describe('[GET] /hobbits', () => {
  beforeEach(async () => {
    await db('hobbits').insert(listOfHobbits)
  })
  it('responds with a 200 OK', async () => {
    const res = await request(server).get('/hobbits')
    expect(res.status).toBe(200)
  })
  it('returns a list of hobbits', async () => {
    const res = await request(server).get('/hobbits')
    console.log(res.body)
    console.log(res.status)
    console.log(res.headers)
    expect(res.body).toMatchObject(listOfHobbits)
    expect(res.body[0]).toMatchObject({ name: 'sam' })
    expect(res.body[0]).toHaveProperty('name', 'sam')
    // const res = request(server).post('/hobbits').send({ name: 'pippin' })
  })
})
