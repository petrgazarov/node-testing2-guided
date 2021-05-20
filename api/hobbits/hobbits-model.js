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
  // the "returning array is great with PO"
  const [id] = await db('hobbits').insert(hobbit, ['id', 'name'])
  return db('hobbits').where('id', id).first()
}

async function update(id, changes) {
  return null
}

function remove(id) {
  return null
}
