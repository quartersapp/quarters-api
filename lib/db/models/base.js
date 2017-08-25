const { Model } = require('objection')
const { camelCase, mapKeys, snakeCase, memoize } = require('lodash')

const toCamelCase = memoize(camelCase)
const toSnakeCase = memoize(snakeCase)

class BaseModel extends Model {
  $formatDatabaseJson (json) {
    json = super.$formatDatabaseJson(json)
    return mapKeys(json, (value, key) => toSnakeCase(key))
  }

  $parseDatabaseJson (json) {
    json = super.$parseDatabaseJson(json)
    return mapKeys(json, (value, key) => toCamelCase(key))
  }

  $beforeInsert () {
    this.created_at = new Date().toISOString()
    this.updated_at = new Date().toISOString()
  }

  $beforeUpdate () {
    this.updated_at = new Date().toISOString()
  }
}

module.exports = BaseModel
