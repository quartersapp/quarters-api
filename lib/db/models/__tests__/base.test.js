/* eslint-env jest */

const MockDate = require('mockdate')
const BaseModel = require('../base')

MockDate.set(new Date())

it('sets createdAt and updatedAt timestamps before an insert', () => {
  const model = new BaseModel()
  model.$beforeInsert()
  expect(model.createdAt).toEqual(new Date().toJSON())
  expect(model.updatedAt).toEqual(new Date().toJSON())
})

it('sets updatedAt timestamp before an update', () => {
  const model = new BaseModel()
  model.$beforeUpdate()
  expect(model.updatedAt).toEqual(new Date().toJSON())
})
