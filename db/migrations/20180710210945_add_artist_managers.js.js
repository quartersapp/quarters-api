exports.up = async (knex) => {
  // host user columns
  await knex.schema.alterTable('artists', table => {
    table.integer('manager_user_id')
    table.foreign('manager_user_id').references('users.id').onDelete('CASCADE')
  })
}

exports.down = async (knex) => {
  await knex.schema.alterTable('artists', table => {
    table.dropColumn('manager_user_id')
  })
}
