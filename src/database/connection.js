const knexfile = require('../../knexfile')
const knex = require('knex')(knexfile['staging'])

module.exports = knex