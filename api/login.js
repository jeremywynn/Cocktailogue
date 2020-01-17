import faunadb from 'faunadb'
require('dotenv').config()

exports.handler = (req, res) => {
	if (req.method === 'POST') {
		let body = ''
		req.on('data', function(data) {
			body += data
			// Too much POST data, kill the connection!
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if (body.length > 1e6) req.connection.destroy()
		})
		req.on('end', async function() {
			try {
				const post = JSON.parse(body)
				const q = faunadb.query
				const client = new faunadb.Client({
					secret: process.env.FAUNADB_SERVER_SECRET
				})
				const response = await client.query(
					q.Login(q.Match(q.Index('users_by_email'), post.username), {
						password: post.password
					})
				)
				res.setHeader('Content-Type', 'application/json')
				res.end(JSON.stringify({ token: response }))
			} catch (err) {
				// console.log('catch statement in login API running!')
				// console.log(err.message)
				res.end(err.message)
			}
		})
	}
}

exports.path = '/api/auth/login'
