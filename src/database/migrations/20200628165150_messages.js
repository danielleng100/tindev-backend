
exports.up = function (knex) {
  return knex.schema.createTable('messages', table => {
    table.increments('id').primary()
    table.string('data').notNullable()
    table.integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .notNullable()
    table.integer('target_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .notNullable()
    table.timestamps(true, true)
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('messages')
};
