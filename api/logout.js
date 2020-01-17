/* eslint-disable prettier/prettier */
import faunadb from "faunadb"
require("dotenv").config()

exports.handler = async (req, res) => {
  const q = faunadb.query
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  })
  await client.query(q.Logout(true))
  res.end()
}

exports.path = '/api/auth/logout'