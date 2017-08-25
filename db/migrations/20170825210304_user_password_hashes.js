exports.up = async knex => {
  await knex.schema.table('users', table => {
    // default passwords to 'password'
    table.string('password_hash').notNull().defaultTo('$2a$10$4iH56vNvavVOEC9CQVukaO/XeXTBsR1jcOj7kAXML1Pcwn6wmKZsW')
  })
}

exports.down = async knex => {
  await knex.schema.table('users', table => {
    table.dropColumn('password_hash')
  })
}
