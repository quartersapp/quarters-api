const { raw } = require('objection')
const { omit } = require('lodash/fp')
const BaseModel = require('./base')
const passwordService = require('lib/services/password-service')

class User extends BaseModel {
  static get tableName () {
    return 'users'
  }

  static findByEmail (email) {
    return this.query().findOne({ email })
  }

  static async findParticipantsForConversations (conversationIds) {
    const users = await User.query()
      .select(raw('users.*, conversation_participants.conversation_id as conversation_id'))
      .join('conversation_participants', 'users.id', 'conversation_participants.user_id')
      .whereIn('conversation_participants.conversation_id', conversationIds)
      .orderBy('conversation_participants.created_at', 'asc')

    return conversationIds.map(id => {
      return users
        .filter(user => user.conversationId === id)
        .map(omit('conversationId'))
    })
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
