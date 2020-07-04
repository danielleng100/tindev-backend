const knex = require('../database/connection')
const { compare } = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
  async create(request, response) {
    const data = request.body

    const [user] = await knex('users')
      .where({ email: data.email })
      .select('*')

    if (!user) return response.status(400).json({ success: false, message: "Cannot find this user" })

    const isAuth = await compare(data.password, user.password)

    if (!isAuth) return response.status(401).json({ success: false, message: "Invalid password" })

    const token = jwt.sign({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
    }, process.env.SECRET_KEY, {
      expiresIn: 60 * 60 * 24,
    })

    return response.json({ success: true, token })
  }
}