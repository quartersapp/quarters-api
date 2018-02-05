/* eslint-env mocha */

const chai = require('chai')
const chaiJestSnapshot = require('chai-jest-snapshot')
chai.use(require('sinon-chai'))
chai.use(require('chai-as-promised'))
chai.use(chaiJestSnapshot)

chaiJestSnapshot.resetSnapshotRegistry()
global.expect = chai.expect
