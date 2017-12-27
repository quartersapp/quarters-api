const BaseModel = require('./base')
const passwordService = require('lib/services/password-service')

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
    return this._maybeHashPassword()
  }

  $beforeUpdate () {
    super.$beforeUpdate()
    this._stringifyRoles()
    return this._maybeHashPassword()
  }

  _stringifyRoles () {
    this.roles = JSON.stringify(this.roles)
  }

  async _maybeHashPassword () {
    if (this.password) {
      this.passwordHash = await passwordService.hash(this.password)
      delete this.password
    }
  }
}

module.exports = User
