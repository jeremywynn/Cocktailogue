import {
	Stitch,
	StitchAppClientConfiguration,
	UserApiKeyCredential
} from 'mongodb-stitch-server-sdk'

const ImageKit = require('imagekit')
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

const imagekit = new ImageKit({
	publicKey: process.env.IMAGEKIT_PUBLIC_API_KEY,
	privateKey: process.env.IMAGEKIT_API_SECRET,
	urlEndpoint: 'https://ik.imagekit.io/94ka2dfnz/'
})

const headers = {
	Accept: 'application/json',
	'Content-Type': 'application/json'
}

exports.handler = async (event, context, callback) => {
	try {
		const jsonContents = JSON.parse(event.body)
		const media = jsonContents.media
		const mediaToDelete = []

		if (media) {
			media.forEach(function(singleMedia) {
				if (singleMedia.path) {
					mediaToDelete.push(singleMedia.path)
				}
			})
		}

		if (mediaToDelete) {
			const deletePromises = mediaToDelete.map(async function(
				mediaItemPath
			) {
				try {
					const deletePromise = await imagekit.deleteFile(
						mediaItemPath
					)
					return deletePromise
				} catch (err) {
					console.log(err)
				}
			})
			await Promise.all(deletePromises)
		}

		await client.auth.loginWithCredential(credential)
		await client.callFunction('removeItem', [jsonContents.ID])
		// console.log(response) // null
		const response = {
			_id: jsonContents.ID
		}
		return {
			statusCode: 200,
			headers,
			body: JSON.stringify(response)
		}
	} catch (error) {
		// console.log(error)
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify(error)
		}
	}
}
