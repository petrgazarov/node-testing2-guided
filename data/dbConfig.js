const knex = require("knex");

const config = require("../knexfile.js");

//----------------------------------------------------------------------------//
// This is where we ensure that we are using the correct environment. There
// should be an environment variable called DB_ENV that specifies which config
// section of the knexfile.js configuration file knex should use.
//
// Why does the environment variable need to be named DB_ENV? Because that's the
// one we are looking for below (we could have easily picked a different variable
// name and it would have been just as fine). No matter what the environment
// variable is named, the *value* of it needs to match the environment
// object/cofig we want to use from knexfile.js.
//
// Here, we are using the value of the environment variable (a string) as an
// index into the array of properties on the object exported from knexfile.js.
//----------------------------------------------------------------------------//
const environment = process.env.DB_ENV || "development";

module.exports = knex(config[environment]);
