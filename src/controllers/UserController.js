const knex = require('../database/connection')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
  async validateEmail(request, response) {
    const { email } = request.params

    const [user] = await knex('users')
      .where({ email })
      .select('email')

    if (user) return response.json({ success: false })

    return response.json({ success: true })
  },

  async validateUsername(request, response) {
    const { username } = request.params

    const [user] = await knex('users')
      .where({ username })
      .select('username')

    if (user) return response.json({ success: false })

    return response.json({ success: true })
  },

  async showByAuth(request, response) {
    const { id, firstName, lastName, username } = request.auth

    return response.json({ id, firstName, lastName, username })
  },

  async showById(request, response) {
    const { id } = request.params

    const [user] = await knex('users')
      .where({ id })
      .select('firstName', 'lastName')

    return response.json(user)
  },

  async showByUsername(request, response) {
    const { username } = request.params

    const users = await knex('users')
      .whereNot({ id: request.auth.id })
      .select('*')

    const serielizedUsers = users.map(user => {
      if (user.username.includes(username)) {
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username
        }
      }
    })

    const notNullUsers = serielizedUsers.filter(val => Boolean(val))

    return response.json(notNullUsers)
  },

  async create(request, response) {
    const data = request.body

    data.password = await bcrypt.hash(data.password, 10)

    const [userId] = await knex('users')
      .insert(data)
      .returning('id')
      
    const [user] = await knex('users')
      .where({ id: userId })
      .select('id', 'username', 'firstName', 'lastName')

    const token = jwt.sign({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
    }, process.env.SECRET_KEY, {
      expiresIn: 60 * 60 * 24,
    })

    return response.json({
      success: true,
      message: 'User created successfully',
      token
    })
  }
}