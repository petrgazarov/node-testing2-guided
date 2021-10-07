//----------------------------------------------------------------------------//
//
// In this test suite, we use supertest to generate API calls into our express
// API server, so we need to require() both supertest, and our server object.
//
// in order for this to work right, we need to make sure that we are
// *instantiating* the express server in one file (along with all of the
// middleware methods, routers, etc.), and that we are *starting* the server to
// listen on another. See notes in ./api/server.js for more context.
//
// The test framework (jest) doesn't manage starting and stopping servers, etc.,
// so if we did server.listen() in the server.js file, then every time jest ran
// a test on our server object, the server would begin listening on the one port
// we are configured to listen on. And the second test that tried to run in
// parallel would fail, because it would try to start the server listening on
// that same port again. Each test execution is in its own environment, so each
// one needs its own copy of Express. We can't have Express start up on the same
// port for each of them, because only one instance can use any given port.
//
// In our setup, we are creating (and exporting) the express server object in
// server.js, and start it in index.js.
//
// For our tests, supertest is able to take the Express.server() instance, and
// start it on an ephemeral port. That way, each time we make a
// request, express is started on a unique port, and tests can run in parallel.
//
//----------------------------------------------------------------------------//
const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

describe('server.js', () => {
  //----------------------------------------------------------------------------//
  // Using the jest globals below help ensure that each test has a pristine
  // database to use, with no leftovers from previous tests.
  //
  // We are using the knex.migrate APIs to ensure a clean schema.
  // We are using .seed() to ensure both a) there are no left over records
  // from previous sessions and b) the database is seeded before each test.
  // We are using .destroy() to clean up the connection pool for knex.
  //----------------------------------------------------------------------------//
  beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
  });

  beforeEach(async () => {
    await db.seed.run();
  });

  afterAll(async () => {
    await db.destroy();
  });

  //------------------------------------------------------------------------//
  // A simple test to verify if we are in the right environment. Our expected
  // results would be wrong if we are in the wrong environment.
  //
  // When we run the "test" script from package.json, the cross-env package is
  // used to set the NODE_ENV environment variable to "testing". That's what
  // causes this to succeed.
  //------------------------------------------------------------------------//
  test('Proper database env variable is set', () => {
    expect(process.env.NODE_ENV).toEqual('testing');
  });

  describe('[GET] /', () => {
    it('returns in valid response', () => {
      return request(server)
        .get('/')
        .expect('Content-Type', /application\/json/)
        .expect(200, { api: 'up' });
    });
  });

  describe('[GET] /hobbits', () => {
    it('returns an array of hobbits', async () => {
      const res = await request(server).get('/hobbits');

      // Does it return the right data?
      //--------------------------------------------------------------------//
      //
      // You know how the Express.json() middleware method takes a stringified
      // JSON object in the request and turns it into an *actual* JSON object
      // in req.body? Well, supertest does something similar - it takes a
      // stringified JSON object in the response and turns it into a *real*
      // JSON object in res.body. This allows us to interact with the response
      // body as an object. After we get res.body from supertest, we use
      // the normal jest matchers to verify that the body has the expected
      // data.
      //--------------------------------------------------------------------//
      expect(res.body).toHaveLength(4);
      
      res.body.forEach(hobbit => {
        expect(hobbit).toHaveProperty('id');
        expect(hobbit).toHaveProperty('name');
      });
    });
  });

  describe('[GET] /hobbits/:id', () => {
    it('returns the hobbit when it exists', async () => {
      const res = await request(server).get('/hobbits/1').expect(200);

      expect(res.body).toMatchObject({ name: 'sam' });
    });

    it("returns a 404 when the hobbit doesn't exist", () => {
      return request(server)
        .get('/hobbits/123')
        .expect(404, { message: 'Hobbit not found' });
    });
  });

  describe('[POST] /hobbits', () => {
    it('returns the new hobbit', async () => {
      const res = await request(server).post('/hobbits').send({ name: 'Frodo 2' }).expect(201);

      expect(res.body).toMatchObject({ name: 'Frodo 2' });
    });
  });

  describe('[PUT] /hobbits/:id', () => {
    it('updates the hobbit if it exists', async () => {
      const res = await request(server).put(`/hobbits/1`).send({ name: 'sam 2' }).expect(200);

      expect(res.body).toMatchObject({ name: 'sam 2' });
    });

    it(`returns a 404 if the hobbit doesn't exist`, async () => {
      return request(server)
        .put('/hobbits/123')
        .send({ name: 'sam 2' })
        .expect(404, { message: 'Hobbit not found' });
    });
  });

  describe('[DELETE] /hobbits/:id', () => {
    it('deletes the hobbit if it exists', async () => {
      await request(server).delete(`/hobbits/1`).expect(204);
    });

    it(`returns a 404 if the hobbit doesn't exist`, async () => {
      return request(server)
        .delete('/hobbits/123')
        .expect(404, { message: 'Hobbit not found' });
    });
  });
});