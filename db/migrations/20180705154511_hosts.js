exports.up = async (knex) => {
  // host user columns
  await knex.schema.alterTable('users', table => {
    table.text('host_bio')
    table.string('host_google_place_id')
  })

  await knex.raw(`
    ALTER TABLE users ADD CONSTRAINT host_required_params CHECK(NOT(roles \\? 'host') OR (
      host_bio IS NOT NULL AND
      host_google_place_id IS NOT NULL
    ))
  `)
}

exports.down = async (knex) => {
  await knex.raw(`
    ALTER TABLE users DROP CONSTRAINT host_required_params
  `)
  await knex.schema.alterTable('users', table => {
    table.dropColumn('host_bio')
    table.dropColumn('host_google_place_id')
  })
}
