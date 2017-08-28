const DataLoader = require('dataloader')
const modelsByIds = require('./models-by-ids')

module.exports = function (Model) {
  let dataLoader // lazily instantiate

  return id => {
    if (!dataLoader) {
      dataLoader = new DataLoader(modelsByIds(Model))
    }

    return dataLoader.load(id)
  }
}
