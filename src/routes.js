const express = require('express')

const route = express.Router()

const authMiddleware = require('./middlewares/auth')

const UserController = require('./controllers/UserController')
const SessionController = require('./controllers/SessionController')
const MessageController = require('./controllers/MessageController')

route.get('/validate/username/:username', UserController.validateUsername)
route.get('/validate/email/:email', UserController.validateEmail)

route.post('/users', UserController.create)
route.post('/sessions', SessionController.create)

route.get('/user', authMiddleware, UserController.showByAuth)
route.get('/contact/:id', authMiddleware, UserController.showById)
route.get('/contacts/:username', authMiddleware, UserController.showByUsername)
route.get('/contacts', authMiddleware, MessageController.index)
route.get('/messages/:id', authMiddleware, MessageController.show)

route.post('/messages/:id', authMiddleware, MessageController.store)

module.exports = route