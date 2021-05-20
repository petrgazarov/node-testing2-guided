const db = require('../../data/dbConfig.js')

module.exports = {
  insert,
  update,
  remove,
  getAll,
  getById,
}

function getAll() {
  return db('hobbits')
}

function getById(id) {
  return null
}

async function insert(hobbit) {
  return db('hobbits').insert(hobbit, ['id', 'name'])
}

async function update(id, changes) {
  return null
}

function remove(id) {
  return null
}
