const { Model } = require('objection')
const { camelCase, mapKeys, snakeCase, memoize } = require('lodash')
const { log } = require('lib/logger/index')

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

  $afterGet () {
    log.info({ type: 'db_query' }, `----> postgres select ${this.constructor.tableName}`)
  }

  $afterInsert () {
    log.info({ type: 'db_query' }, `----> postgres insert ${this.constructor.tableName}`)
  }

  $afterUpdate () {
    log.info({ type: 'db_query' }, `----> postgres update ${this.constructor.tableName}`)
  }

  $afterDelete () {
    log.info({ type: 'db_query' }, `----> postgres delete ${this.constructor.tableName}`)
  }
}

module.exports = BaseModel
