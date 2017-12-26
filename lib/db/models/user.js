const BaseModel = require('./base')

class User extends BaseModel {
  static get tableName () {
    return 'users'
  }

  isAdmin () {
    return this.roles.includes('admin')
  }

  $beforeInsert () {
    super.$beforeInsert()
    this._stringifyRoles()
  }

  $beforeUpdate () {
    super.$beforeUpdate()
    this._stringifyRoles()
  }

  _stringifyRoles () {
    this.roles = JSON.stringify(this.roles)
  }
}

module.exports = User
