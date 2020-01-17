const request = require('request')
exports.handler = (req, res) => {
	try {
		const authToken = req.headers.authorization
		const options = {
			url:
				'https://' +
				authToken.substring(7) +
				':' +
				'@db.fauna.com/tokens/self'
		}
		request(options, function(error, response, body) {
			if (!error && response.statusCode === 200) {
				res.setHeader('Content-Type', 'application/json')
				res.end(JSON.stringify({ user: response }))
			} else {
				console.log(error)
				res.end()
			}
		})
	} catch (error) {
		// console.log(error)
	}
}

exports.path = '/api/auth/user'
