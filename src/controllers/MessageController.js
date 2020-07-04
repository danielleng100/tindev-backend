const knex = require('../database/connection')

module.exports = {
  async index(request, response) {
    const query01 = `SELECT
    CASE
      
    WHEN
      u_user."id" <> ${request.auth.id} THEN
        u_user."id" 
        WHEN u_target."id" <> ${request.auth.id} THEN
        u_target."id" 
      END AS "usuario_id",
    CASE
        
        WHEN u_user."id" <> ${request.auth.id} THEN
        u_user."firstName" 
        WHEN u_target."id" <> ${request.auth.id} THEN
        u_target."firstName" 
      END AS "firstName1",
    CASE
        
        WHEN u_user."id" <> ${request.auth.id} THEN
        u_user."lastName" 
        WHEN u_target."id" <> ${request.auth.id} THEN
        u_target."lastName" 
      END AS "lastName1",
      MAX ( messages."created_at" ) AS "datetime" 
    FROM
      messages
      INNER JOIN users u_user ON u_user."id" = messages."user_id"
      INNER JOIN users u_target ON u_target."id" = messages."target_id"
    WHERE
      u_user."id" = ${request.auth.id} 
      OR u_target."id" = ${request.auth.id} 
    GROUP BY
      "usuario_id",
      "firstName1",
      "lastName1" 
    ORDER BY
    "datetime" DESC`

    const users = await knex.raw(query01)

    let messages = []

    if (users.rows.length) {
      messages = users.rows.map(async user => {
        const query02 = `SELECT
        CASE
            
          WHEN
            u_user."id" <> ${user.usuario_id} THEN
              0 
              WHEN u_target."id" <> ${user.usuario_id} THEN
              1 
            END AS target,
          messages."data", messages."id"	
              FROM
                messages
                INNER JOIN users u_user ON u_user."id" = messages."user_id"
                INNER JOIN users u_target ON u_target."id" = messages."target_id" 
              WHERE
              (u_user."id" = ${request.auth.id} AND u_target."id" = ${user.usuario_id}) OR (u_user."id" = ${user.usuario_id} AND u_target."id" = ${request.auth.id})
                ORDER BY
        messages."created_at" DESC
        LIMIT 1`

        const data = await knex.raw(query02)

        return {
          user_id: user.usuario_id,
          firstName: user.firstName1,
          lastName: user.lastName1,
          message_id: data.rows[0].id,
          message: data.rows[0].data,
          target: data.rows[0].target,
          datetime: user.datetime
        }
      });
    }

    Promise.all(messages).then(value => response.json(value))
  },

  async show(request, response) {
    const { id } = request.params

    const [target] = await knex('users')
      .where({ id })
      .select('id')

    if (!target) return response.status(400).json({ message: "User does not exist" })

    const messages = await knex('messages')
      .where({ user_id: request.auth.id, target_id: target.id })
      .orWhere({ user_id: target.id, target_id: request.auth.id })
      .orderBy('id', 'asc')
      .select('id', 'data', 'user_id', 'created_at')

    return response.json(messages)
  },

  async store(request, response) {
    const { data } = request.body
    const { id } = request.params

    const { io } = request
    const { connectedUsers } = request

    const [target] = await knex('users')
      .where({ id })
      .select('id')

    if (!target) return response.json({ message: 'User does not exist' })

    const loggedSocket = connectedUsers[request.auth.id]
    const targetSocket = connectedUsers[target.id]

    if (loggedSocket) io.to(loggedSocket).emit('message', 'reload')

    if (targetSocket) io.to(targetSocket).emit('message', 'reload')

    await knex('messages').insert({ data, user_id: request.auth.id, target_id: target.id })

    return response.json({ success: true })
  }
}