module.exports = {
  name (user, args, context, info) {
    if (user.firstName) {
      return user.lastName
        ? `${user.firstName} ${user.lastName.charAt(0)}.`
        : user.firstName
    } else {
      return user.email
    }
  }
}
