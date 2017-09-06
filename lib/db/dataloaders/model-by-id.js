const DataLoader = require('dataloader')
const modelsByIds = require('./models-by-ids')

module.exports = (Model) => new DataLoader(modelsByIds(Model))
