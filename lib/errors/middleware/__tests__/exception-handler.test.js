/* eslint-env jest */

const exceptionHandler = require('../exception-handler')

it('responds with a 500 error if an unexpected exception occurs', async () => {
  const ctx = {}
  const next = jest.fn(() => {
    throw new Error('Database crash')
  })

  await exceptionHandler()(ctx, next)

  expect(ctx).toEqual({
    body: { message: 'Unexpected error' },
    status: 500
  })
})
