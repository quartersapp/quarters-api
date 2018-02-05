/* eslint-env mocha */

const MockDate = require('mockdate')
const BaseModel = require('../base')

describe('db/models/base', () => {
  before(() => MockDate.set(new Date()))
  after(() => MockDate.reset())

  it('sets createdAt and updatedAt timestamps before an insert', () => {
    const model = new BaseModel()
    model.$beforeInsert()
    expect(model.createdAt).to.equal(new Date().toJSON())
    expect(model.updatedAt).to.equal(new Date().toJSON())
  })

  it('sets updatedAt timestamp before an update', () => {
    const model = new BaseModel()
    model.$beforeUpdate()
    expect(model.updatedAt).to.equal(new Date().toJSON())
  })
})
