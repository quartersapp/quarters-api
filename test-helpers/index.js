const path = require('path')
const chaiJestSnapshot = require('chai-jest-snapshot')

module.exports = {
  truncate: require('./truncate'),
  fixture: require('./fixture'),
  enableSnapshots: function () {
    chaiJestSnapshot.configureUsingMochaContext(this)
    const { currentTest } = this
    const filename = path.resolve(path.dirname(currentTest.file), '__snapshots__', path.basename(currentTest.file) + '.snap')
    chaiJestSnapshot.setFilename(filename)
    chaiJestSnapshot.setTestName(currentTest.title)
  }
}
