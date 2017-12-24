exports.up = async (knex) => {
  // cities
  await knex.schema.raw('CREATE SEQUENCE cities_id_seq')
  await knex.schema.createTable('cities', table => {
    table.integer('id').primary()
    table.string('name').notNull()
    table.string('google_place_id').notNull().unique()
    table.timestamps()
  })
  await knex.schema.raw(`
    ALTER TABLE cities ALTER COLUMN id SET DEFAULT bounded_pseudo_encrypt(nextval('cities_id_seq')::int, 16777215, 0);
  `)

  // venues
  await knex.schema.raw('CREATE SEQUENCE venues_id_seq')
  await knex.schema.createTable('venues', table => {
    table.integer('id').primary()
    table.string('name').notNull()
    table.integer('city_id').notNull()
    table.string('google_place_id').notNull()
    table.timestamps()

    table.foreign('city_id')
      .references('cities.id')
      .onDelete('RESTRICT')
  })
  await knex.schema.raw(`
    ALTER TABLE venues ALTER COLUMN id SET DEFAULT bounded_pseudo_encrypt(nextval('venues_id_seq')::int, 16777215, 0);
  `)

  // shows
  await knex.schema.raw('CREATE SEQUENCE shows_id_seq')
  await knex.schema.createTable('shows', table => {
    table.integer('id').primary()
    table.date('day').notNull()
    table.time('door_time')
    table.string('age_restriction')
    table.string('ticket_link')
    table.integer('venue_id').notNull()
    table.timestamps()

    table.foreign('venue_id')
      .references('venues.id')
      .onDelete('RESTRICT')
  })
  await knex.schema.raw(`
    ALTER TABLE shows ALTER COLUMN id SET DEFAULT bounded_pseudo_encrypt(nextval('shows_id_seq')::int, 16777215, 0);
  `)

  // artists
  await knex.schema.raw('CREATE SEQUENCE artists_id_seq')
  await knex.schema.createTable('artists', table => {
    table.integer('id').primary()
    table.string('name').notNull()
    table.text('bio').notNull().defaultTo('')
    table.integer('city_id').notNull()
    table.timestamps()

    table.foreign('city_id')
      .references('cities.id')
      .onDelete('RESTRICT')
  })
  await knex.schema.raw(`
    ALTER TABLE artists ALTER COLUMN id SET DEFAULT bounded_pseudo_encrypt(nextval('artists_id_seq')::int, 16777215, 0);
  `)

  // show artists
  await knex.schema.createTable('show_artists', table => {
    table.integer('show_id').notNull()
    table.integer('artist_id').notNull()
    table.integer('position').notNull().defaultTo(0)
    table.timestamps()

    table.foreign('show_id')
      .references('shows.id')
      .onDelete('CASCADE')
    table.foreign('artist_id')
      .references('artists.id')
      .onDelete('CASCADE')

    table.primary(['show_id', 'artist_id'])
    table.unique(['show_id', 'position'])
  })

  // genres
  await knex.schema.raw('CREATE SEQUENCE genres_id_seq')
  await knex.schema.createTable('genres', table => {
    table.integer('id').primary()
    table.string('name').notNull()
    table.timestamps()

    table.unique('name')
  })
  await knex.schema.raw(`
    ALTER TABLE genres ALTER COLUMN id SET DEFAULT bounded_pseudo_encrypt(nextval('genres_id_seq')::int, 16777215, 0);
  `)

  // artist genres
  await knex.schema.createTable('artist_genres', table => {
    table.integer('artist_id').notNull()
    table.integer('genre_id').notNull()
    table.integer('position').notNull().defaultTo(0)
    table.timestamps()

    table.foreign('artist_id')
      .references('artists.id')
      .onDelete('CASCADE')
    table.foreign('genre_id')
      .references('genres.id')
      .onDelete('CASCADE')

    table.primary(['artist_id', 'genre_id'])
    table.unique(['artist_id', 'position'])
  })
}

exports.down = async (knex) => {
  await knex.schema.raw('DROP TABLE artist_genres CASCADE')
  await knex.schema.raw('DROP TABLE genres CASCADE')
  await knex.schema.raw('DROP SEQUENCE genres_id_seq')
  await knex.schema.raw('DROP TABLE show_artists CASCADE')
  await knex.schema.raw('DROP TABLE artists CASCADE')
  await knex.schema.raw('DROP SEQUENCE artists_id_seq')
  await knex.schema.raw('DROP TABLE shows CASCADE')
  await knex.schema.raw('DROP SEQUENCE shows_id_seq')
  await knex.schema.raw('DROP TABLE venues CASCADE')
  await knex.schema.raw('DROP SEQUENCE venues_id_seq')
  await knex.schema.raw('DROP TABLE cities CASCADE')
  await knex.schema.raw('DROP SEQUENCE cities_id_seq')
}
