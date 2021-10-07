const knex = require("knex");

const config = require("../knexfile.js");

//----------------------------------------------------------------------------//
// This is where we ensure that we are using the correct environment. There
// should be NODE_ENV environment variable that specifies which config
// section of the knexfile.js configuration file knex should use.
//
// Here, we are using the value of the environment variable (a string) as an
// index into the array of properties on the object exported from knexfile.js.
//----------------------------------------------------------------------------//
const environment = process.env.NODE_ENV || "development";

module.exports = knex(config[environment]);
