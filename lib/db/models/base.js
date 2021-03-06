const { Model, snakeCaseMappers } = require('objection')

class BaseModel extends Model {
  static get columnNameMappers () {
    return snakeCaseMappers()
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

  static insert (params = {}, opts = {}) {
    return this.query(opts.trx).insert(params)
  }

  static create (params = {}, opts = {}) {
    return this.query(opts.trx).insert(params).returning('*')
  }

  static findById (id) {
    return this.query().findById(id)
  }
}

module.exports = BaseModel
