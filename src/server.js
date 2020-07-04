const express = require('express')
const cors = require('cors')
require('dotenv').config()

const routes = require('./routes')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(cors())

const connectedUsers = {}

io.on('connection', client => {
  const { id } = client.handshake.query

  connectedUsers[id] = client.id
})

app.use((request, response, next) => {
  request.io = io
  request.connectedUsers = connectedUsers

  next()
})

app.use(express.json())
app.use(routes)

server.listen(process.env.PORT, () => console.log('Server running at port', process.env.PORT))
