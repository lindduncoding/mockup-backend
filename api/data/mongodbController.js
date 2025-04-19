
import { MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const DB_URI = process.env.DB_URI

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_URI}/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// Return a database handle for use with queries
export function getDBHandle (dbName) {
    return client.db(dbName)
}

export async function getUser (DBHandle, username) {
  await client.connect()
  const usersCollection = DBHandle.collection('users')
  const user = await usersCollection.findOne({ username })
  return user
}
