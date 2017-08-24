const CREATE_PSEUDO_ENCRYPT_24 = `
  CREATE FUNCTION pseudo_encrypt_24(VALUE int) returns int AS $$
  DECLARE
  l1 int;
  l2 int;
  r1 int;
  r2 int;
  i int:=0;
  BEGIN
    l1:= (VALUE >> 12) & (4096-1);
    r1:= VALUE & (4096-1);
    WHILE i < 3 LOOP
      l2 := r1;
      r2 := l1 # ((((1366 * r1 + 150889) % 714025) / 714025.0) * (4096-1))::int;
    l1 := l2;
    r1 := r2;
    i := i + 1;
    END LOOP;
    RETURN ((l1 << 12) + r1);
  END;
  $$ LANGUAGE plpgsql strict immutable;
`

const CREATE_BOUNDED_PSEUDO_ENCRYPT = `
  CREATE FUNCTION bounded_pseudo_encrypt(VALUE int, MAX int, MIN int) returns int AS $$
  BEGIN
    LOOP
      VALUE := pseudo_encrypt_24(VALUE);
      EXIT WHEN VALUE <= MAX AND VALUE >= MIN;
    END LOOP;
    RETURN VALUE;
  END
  $$ LANGUAGE plpgsql strict immutable;
`

exports.up = async (knex) => {
  // create id generator functions
  await knex.schema.raw(CREATE_PSEUDO_ENCRYPT_24)
  await knex.schema.raw(CREATE_BOUNDED_PSEUDO_ENCRYPT)

  // create users table
  await knex.schema.raw('CREATE SEQUENCE users_id_seq')
  await knex.schema.createTable('users', table => {
    table.integer('id').primary()
    table.string('email').unique().notNull()
    table.string('password_hash').notNull()
    table.timestamps()
  })
  await knex.schema.raw(`
    ALTER TABLE users ALTER COLUMN id SET DEFAULT bounded_pseudo_encrypt(nextval('users_id_seq')::int, 16777215, 0);
  `)

  // create oauth tables
  await knex.schema.createTable('oauth_clients', table => {
    table.increments()
    table.string('client_secret').notNull()
    table.string('redirect_uri').notNull()
    table.timestamps()
  })
  await knex.schema.createTable('oauth_tokens ', table => {
    table.increments()
    table.string('access_token').notNull()
    table.index('access_token')
    table.dateTime('access_token_expires_on').notNull()
    table.integer('client_id').notNull()
    table.foreign('client_id').references('oauth_clients.id').onDelete('restrict')
    table.string('refresh_token').notNull()
    table.dateTime('refresh_token_expires_on').notNull()
    table.integer('user_id').notNull()
    table.foreign('user_id').references('users.id').onDelete('cascade')
  })
}

exports.down = async (knex) => {
  await knex.raw('DROP TABLE oauth_tokens CASCADE')
  await knex.raw('DROP TABLE oauth_clients CASCADE')
  await knex.raw('DROP TABLE users CASCADE')
  await knex.schema.raw('DROP SEQUENCE users_id_seq')
  await knex.schema.raw('DROP FUNCTION pseudo_encrypt_24(VALUE int);')
  await knex.schema.raw('DROP FUNCTION bounded_pseudo_encrypt(VALUE int, MAX int, MIN int);')
}
