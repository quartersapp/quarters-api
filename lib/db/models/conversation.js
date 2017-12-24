const BaseModel = require('./base')

class Conversation extends BaseModel {
  static get tableName () {
    return 'conversations'
  }
}

module.exports = Conversation
