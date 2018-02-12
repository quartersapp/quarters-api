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
    if (!this.createdAt) {
      this.createdAt = new Date().toISOString()
    }

    if (!this.updatedAt) {
      this.updatedAt = new Date().toISOString()
    }
  }

  $beforeUpdate () {
    this.updatedAt = new Date().toISOString()
  }

  static insert (params = {}) {
    return this.query().insert(params)
  }

  static create (params = {}) {
    return this.query().insert(params).returning('*')
  }

  static findById (id) {
    return this.query().findById(id)
  }
}

module.exports = BaseModel
