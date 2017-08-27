const DataLoader = require('dataloader')

const modelByIds = Model => async ids => {
  const records = await Model.query().whereIn('id', ids).orderBy('id', 'asc')

  /**
   * There may be ids that didn't return a user.
   * We need to map ids to users by iterating over ids and return the corresponding user, or null.
   * To decrease lookup time, remove user from users array each time one was found.
   */

  return ids.map((id, index) => {
    const indexOfRecord = records.findIndex(record => record.id === id)
    if (indexOfRecord === -1) {
      return null
    } else {
      const [record] = records.splice(indexOfRecord, 1)
      return record
    }
  })
}

module.exports = function (Model) {
  let dataLoader // lazily instantiate

  return id => {
    if (!dataLoader) {
      dataLoader = new DataLoader(modelByIds(Model))
    }

    return dataLoader.load(id)
  }
}

module.exports.modelByIds = modelByIds // for testing
