// Update with your config settings.

const { resolve } = require("path");

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    }
  },

  staging: {
    client: 'pg',
    connection: {
      host: '192.168.99.100',
      port: '5432',
      database: 'tindev-chat',
      user:     'docker',
      password: 'docker'
    },
    migrations: {
      directory: resolve(__dirname, 'src', 'database', 'migrations'),
      tableName: 'knex_migrations'
    },

  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: resolve(__dirname, 'src', 'database', 'migrations'),
      tableName: 'knex_migrations'
    },
  }

};
