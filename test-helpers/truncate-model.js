module.exports = Model => {
  return Model.knex().raw(`TRUNCATE TABLE ${Model.tableName} CASCADE`)
}
