import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import LoginRouter from '../routes/login.js'
import BalanceRouter from '../routes/balance.js'

const app = express()
app.use(bodyParser.json())

dotenv.config()
const PORT = 3000

// Import Routes

// Attach data router, include 'data' before the endpoint name
app.use('/', LoginRouter)
app.use('/', BalanceRouter)

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`)
// })

export default function handler(req, res) {
  return app(req, res)
}
