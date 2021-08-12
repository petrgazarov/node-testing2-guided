const common = {
  client: 'sqlite3',
  useNullAsDefault: true,
  migrations: { directory: './data/migrations' },
  seeds: { directory: './data/seeds' },
}

//----------------------------------------------------------------------------//
// When we run tests, we often have "set up" and "tear down" in order to
// create the right environment for our tests. One of the things that we may
// need to do is empty or reset a database. But we may have valuable, important,
// or critical data in the database that is supporting our
// engineering/development efforts. So we want a "testing" environment that uses
// a different database.
//
// The knex library supports different environments. The object that is being
// exported has multiple properties - there is one called "development" and
// one called "testing". These contain options/settings/configuration
// specific to that environment, allowing us to treat these two environments
// separately. These are used when we initialize knex, in the ./data/dbConfig.js
// file. There, we get an instance of the function that the knex package
// exports, and call it with a configuration object. We can use a string as an
// index into this object: config['testing'] for example.
//
// In this project, we are using an environment variable, DB_ENV, to specify
// which environment in knex we want to use. We could set that environment
// variable a variety of ways, including using the .env file. Or, we can use
// a script definition in package.json to set the environment variable.
//
// See package.json: we are using a package called "cross-env", which allows
// you to set environment variables using a common syntax, regardless of what
// operating system you are on, or what shell you are using. In our example,
// there, we are setting DB_ENV to "testing" using cross-env in the "test"
// script. This causes us to use the "testing" object below when knex is
// configured in ./data/dbConfig.js.
//----------------------------------------------------------------------------//
module.exports = {
  development: {
    ...common,
    connection: {
      filename: './data/hobbits.db3',
    },
  },
  testing: {
    ...common,
    connection: {
      filename: './data/test.db3',
    },
  },
  production: {

  },
};
