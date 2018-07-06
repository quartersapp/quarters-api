const { isArray } = require('lodash')

module.exports = models => {
  if (!isArray(models)) {
    models = [models]
  }

  return Promise.all(models.map(Model => {
    return Model.knex().raw(`TRUNCATE TABLE ${Model.tableName} CASCADE`)
  }))
}
