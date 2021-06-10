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
const db = require('../data/dbConfig.js');
const Hobbit = require('./hobbits/hobbits-model');

describe('server.js', () => {
  //----------------------------------------------------------------------------//
  // Using the jest globals below help ensure that each test has a pristine
  // database to use, with no leftovers from previous tests.
  //
  // We are using the knex.migrate APIs to ensure a clean schema.
  // We are using .truncate() to ensure there are no left over records from
  // previous sessions.
  // We are using .destroy() to clean up the connection pool for knex.
  //----------------------------------------------------------------------------//
  beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
  });

  beforeEach(async () => {
    await db('hobbits').truncate();
  });

  afterAll(async () => {
    await db.destroy();
  });

  //------------------------------------------------------------------------//
  // A simple test to verify if we are in the right environment. Our expected
  // results would be wrong if we are in the wrong environment.
  //
  // When we run the "test" script from package.json, the cross-env package is
  // used to set the DB_ENV environment variable to "testing". That's what
  // causes this to succeed. If you try to run "jest" at the command line
  // (without the "test" script syntax that sets the DB_ENV environment
  // variable), this test will fail, because DB_ENV won't be set to anything.
  //------------------------------------------------------------------------//
  test('Proper database env variable is set', () => {
    expect(process.env.DB_ENV).toEqual('testing');
  });

  describe('[GET] /', () => {
    it('returns a valid response', () => {
      return request(server)
        .get('/')
        .expect('Content-Type', /application\/json/)
        .expect(200, { api: 'up' });
    });
  });

  describe('[GET] /hobbits', () => {
    beforeEach(async () => {
      await Hobbit.insert({ name: 'Frodo' });
      await Hobbit.insert({ name: 'Sam' });
    });

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
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toMatchObject({ name: 'Frodo' });
      expect(res.body[1]).toMatchObject({ name: 'Sam' });
    });
  });

  describe('[GET] /hobbits/:id', () => {
    let hobbit;
    beforeEach(async () => {
      hobbit = await Hobbit.insert({ name: 'Frodo' });
    });

    it('returns a hobbit when it exists', async () => {
      const res = await request(server).get(`/hobbits/${hobbit.id}`);

      expect(res.body).toMatchObject({ name: 'Frodo' });
    });

    it(`returns a 404 when the hobbit doesn't exist`, async () => {
      const res = await request(server).get('/hobbits/12345').expect(404);

      expect(res.body).toMatchObject({ message: 'Hobbit not found' });
    });
  });

  describe('[POST] /hobbits', () => {
    it('creates a hobbit and returns it', async () => {
      const res = await request(server).post('/hobbits').send({ name: 'Frodo' });

      expect(res.body).toMatchObject({ name: 'Frodo' }); // Verify the response
      expect(await Hobbit.getAll()).toHaveLength(1); // Verify that the record was inserted into the db
    });
  });

  describe('[PUT] /hobbits/:id', () => {
    let hobbit;
    beforeEach(async () => {
      hobbit = await Hobbit.insert({ name: 'Frodo' });
    });

    it('updates the hobbit when it exists', async () => {
      const res = await request(server).put(`/hobbits/${hobbit.id}`).send({ name: 'Frodo 1' });

      expect(res.body).toMatchObject({ name: 'Frodo 1' }); // Verify the response
      expect(await Hobbit.getById(hobbit.id)).toMatchObject({ name: 'Frodo 1' }); // Verify that the change was recorded in the db
    });

    it(`returns a 404 when the hobbit doesn't exist`, async () => {
      const res = await request(server).put('/hobbits/12345').send({ name: 'Frodo 1' });

      expect(res.body).toMatchObject({ message: 'Hobbit not found' }); // Verify the response
      expect(await Hobbit.getById(hobbit.id)).toMatchObject({ name: 'Frodo' }); // Verify that the other hobbit is unchaged
    });
  });

  describe('[DELETE] /hobbits/:id', () => {
    let hobbit;
    beforeEach(async () => {
      hobbit = await Hobbit.insert({ name: 'Frodo' });
    });

    it('deletes the hobbit when it exists', async () => {
      const res = await request(server).delete(`/hobbits/${hobbit.id}`).expect(200);

      expect(res.body).toMatchObject({ message: 'Success' }); // Verify the response
      expect(await Hobbit.getById(hobbit.id)).toBeUndefined(); // Verify that the hobbit was removed from the db
    });

    it(`returns a 404 when the hobbit doesn't exist`, async () => {
      const res = await request(server).delete('/hobbits/12345');

      expect(res.body).toMatchObject({ message: 'Hobbit not found' }); // Verify the response
      expect(await Hobbit.getById(hobbit.id)).not.toBeUndefined(); // Verify that the other hobbit was not removed from the db
    });
  });
});
