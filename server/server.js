import express from 'express'
import jwt from 'jsonwebtoken'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import fs from 'fs'

const app = express()
app.use(bodyParser.json())

dotenv.config()

const SECRET_KEY = process.env.PRIVATE_KEY
const PORT = 3000

// Login Route — returns JWT

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync('./server/data/users.json'))

  const user = users.find(u => u.username === username)
  if (!user) {
    return res.status(401).json({ message: 'User not found' })
  }

  // Compare password using bcrypt
  const passwordMatch = bcrypt.compareSync(password, user.password)
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Incorrect password' })
  }

  const token = jwt.sign({ username: user.username, balance: user.balance }, SECRET_KEY, {
    expiresIn: '1h',
    algorithm: 'HS256'
  })

  res.json({ token })
})

// Middleware to check JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.sendStatus(401)

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// Protected route
app.get('/balance', authenticateToken, (req, res) => {
  res.json({ 
    balance: req.user.balance
  })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
