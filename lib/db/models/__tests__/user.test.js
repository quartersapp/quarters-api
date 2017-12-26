/* eslint-env jest */

const User = require('../user')

describe('isAdmin', () => {
  it('returns true if the user has an admin role', () => {
    const user = new User()

    user.roles = []
    expect(user.isAdmin()).toEqual(false)

    user.roles = ['admin']
    expect(user.isAdmin()).toEqual(true)
  })
})

describe('roles', () => {
  it('automatically stringifies roles before insertion & update', async () => {
    const user = new User()

    user.roles = []
    user.$beforeInsert()
    expect(user.roles).toEqual('[]')
    expect(user.createdAt).toBeTruthy()
    expect(user.updatedAt).toBeTruthy()

    user.roles = []
    user.$beforeUpdate()
    expect(user.roles).toEqual('[]')
    expect(user.updatedAt).toBeTruthy()
  })
})
