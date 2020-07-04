const jwt  = require('jsonwebtoken')

module.exports = function(request, response, next) {
  const { authorization } = request.headers

  if (!authorization) return response.status(401).json({ error: 'No token provided' })

  const parts = authorization.split(' ')

  if (!parts.length === 2) return response.status(401).json({ error: 'Token error' })

  const [scheme, token] = parts
  
  if (!/^Bearer$/i.test(scheme)) return response.status(401).json({ error: 'Malformatted token' })
  
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return response.status(401).json({ error: 'Invalid token' })

    request.auth = { 
      id: decoded.id, 
      username: decoded.username, 
      firstName: decoded.firstName,
      lastName: decoded.lastName
    }

    next()
  })
}