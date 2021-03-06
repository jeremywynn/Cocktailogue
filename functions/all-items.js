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
		let limit = 20
		let waypointID = null
		if (event.body !== null && event.body !== undefined) {
			const jsonContents = JSON.parse(event.body)
			if (jsonContents.limit) {
				limit = jsonContents.limit
			}
			if (jsonContents.waypointID) {
				waypointID = jsonContents.waypointID
			}
		}
		await client.auth.loginWithCredential(credential)
		const items = await client.callFunction('getItems', [waypointID, limit])
		return {
			statusCode: 200,
			headers,
			body: JSON.stringify(items)
		}
	} catch (error) {
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify(error)
		}
	}
}
