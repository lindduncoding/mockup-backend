import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()
const SECRET_KEY = process.env.PRIVATE_KEY

router.post('/login', (req, res) => {
  const { username, password } = req.body
  const users = JSON.parse(fs.readFileSync('./server/data/users.json'))

  const user = users.find(u => u.username === username)
  if (!user) {
    return res.status(401).json({ message: 'User not found' })
  }

  const passwordMatch = bcrypt.compareSync(password, user.password)
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Incorrect password' })
  }

  const token = jwt.sign(
    { username: user.username, balance: user.balance },
    SECRET_KEY,
    { expiresIn: '1h', algorithm: 'HS256' }
  )

  res.json({ token })
})

export default router
