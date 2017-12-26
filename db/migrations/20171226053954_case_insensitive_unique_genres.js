exports.up = async (knex, Promise) => {
  await knex.schema.alterTable('genres', table => {
    table.dropUnique('name')
  })
  await knex.schema.raw(`
    CREATE UNIQUE INDEX genres_lower_name_unique on genres (lower(name))
  `)
}

exports.down = async (knex, Promise) => {
  await knex.schema.raw('DROP INDEX genres_lower_name_unique')
  await knex.schema.alterTable('genres', table => {
    table.unique('name')
  })
}
