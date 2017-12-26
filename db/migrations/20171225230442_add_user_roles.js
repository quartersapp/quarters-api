exports.up = async function (knex, Promise) {
  await knex.schema.alterTable('users', table => {
    table.jsonb('roles').defaultTo('[]')
  })
}

exports.down = async function (knex, Promise) {
  await knex.schema.alterTable('users', table => {
    table.dropColumn('roles')
  })
}
