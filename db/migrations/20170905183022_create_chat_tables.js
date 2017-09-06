exports.up = async knex => {
  // create conversations table
  await knex.schema.raw('CREATE SEQUENCE conversations_id_seq')
  await knex.schema.createTable('conversations', table => {
    table.integer('id').primary()
    table.timestamps()
  })
  await knex.schema.raw(`
    ALTER TABLE conversations ALTER COLUMN id SET DEFAULT bounded_pseudo_encrypt(nextval('conversations_id_seq')::int, 16777215, 0);
  `)

  // create conversation participants
  await knex.schema.raw('CREATE SEQUENCE conversation_participants_id_seq')
  await knex.schema.createTable('conversation_participants', table => {
    table.integer('id').primary()
    table.integer('conversation_id').notNull()
    table.foreign('conversation_id').references('conversations.id').onDelete('CASCADE')
    table.integer('user_id').notNull()
    table.foreign('user_id').references('users.id').onDelete('CASCADE')
    table.timestamps()
    table.unique(['conversation_id', 'user_id'])
  })
  await knex.schema.raw(`
    ALTER TABLE conversation_participants ALTER COLUMN id SET DEFAULT bounded_pseudo_encrypt(nextval('conversation_participants_id_seq')::int, 16777215, 0);
  `)

  // create chat messages
  await knex.schema.raw('CREATE SEQUENCE chat_messages_id_seq')
  await knex.schema.createTable('chat_messages', table => {
    table.integer('id').primary()
    table.string('body', 20000).notNull().defaultsTo('')
    table.integer('conversation_id').notNull()
    table.foreign('conversation_id').references('conversations.id').onDelete('CASCADE')
    table.integer('user_id').notNull()
    table.foreign('user_id').references('users.id').onDelete('CASCADE')
    table.timestamps()
  })
  await knex.schema.raw(`
    ALTER TABLE chat_messages ALTER COLUMN id SET DEFAULT bounded_pseudo_encrypt(nextval('chat_messages_id_seq')::int, 16777215, 0);
  `)
}

exports.down = async knex => {
  await knex.raw('DROP TABLE chat_messages CASCADE')
  await knex.schema.raw('DROP SEQUENCE chat_messages_id_seq')
  await knex.raw('DROP TABLE conversation_participants CASCADE')
  await knex.schema.raw('DROP SEQUENCE conversation_participants_id_seq')
  await knex.raw('DROP TABLE conversations CASCADE')
  await knex.schema.raw('DROP SEQUENCE conversations_id_seq')
}
