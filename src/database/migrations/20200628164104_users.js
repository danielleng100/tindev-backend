
exports.up = function (knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary()
    table.string('firstName').notNullable()
    table.string('lastName').notNullable()
    table.string('username', 80).notNullable().unique()
    table.string('email', 254).notNullable().unique()
    table.string('password', 60).notNullable()
    table.timestamps(true, true)
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('users')
};
