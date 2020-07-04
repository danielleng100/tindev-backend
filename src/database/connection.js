const knexfile = require('../../knexfile')
const knex = require('knex')(knexfile[process.env.DB_CONNECTION])

module.exports = knex