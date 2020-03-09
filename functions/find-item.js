import {
	Stitch,
	StitchAppClientConfiguration,
	UserApiKeyCredential
} from 'mongodb-stitch-server-sdk'

require('dotenv').config()

let dataDirectory = ''

const isLambda = !!(process.env.LAMBDA_TASK_ROOT || false)

if (isLambda) {
	dataDirectory = '/tmp'
}

const client = Stitch.initializeDefaultAppClient(
	process.env.MONGODB_STITCH_APP_ID,
	new StitchAppClientConfiguration.Builder()
		.withDataDirectory(dataDirectory)
		.build()
)

const credential = new UserApiKeyCredential(process.env.MONGODB_API_KEY)

const headers = {
	Accept: 'application/json',
	'Content-Type': 'application/json'
}

exports.handler = async (event, context, callback) => {
	try {
		const itemID = JSON.parse(event.body)
		await client.auth.loginWithCredential(credential)
		const response = await client.callFunction('getItem', [itemID])
		return {
			statusCode: 200,
			headers,
			body: JSON.stringify(response)
		}
	} catch (error) {
		console.log(error)
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify(error)
		}
	}
}
