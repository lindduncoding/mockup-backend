import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const router = express.Router()
const SECRET_KEY = process.env.PRIVATE_KEY

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Safe path to your users.json
const usersPath = path.join(__dirname, '../server/data/users.json')

router.post('/login', (req, res) => {
  const { username, password } = req.body
  const users = JSON.parse(fs.readFileSync(usersPath))

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
