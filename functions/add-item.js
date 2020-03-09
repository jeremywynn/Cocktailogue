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
		const data = jsonContents
		const media = data.media

		if (media) {
			const uploadPromises = media.map(async function(mediaItem) {
				try {
					const uploadPromise = await imagekit.uploadViaURL(
						mediaItem.url,
						{
							filename: mediaItem.id,
							folder: '/'
						}
					)
					return uploadPromise
				} catch (err) {
					// Tenuous, e.g. Instagram's asset URLs are temporary
					return mediaItem
				}
			})
			const uploadedMedia = await Promise.all(uploadPromises)
			console.log('uploadedMedia Promise.all has RESOLVED!!!')
			uploadedMedia.forEach(function(singleUpload, index) {
				if (singleUpload.imagePath) {
					this[index].path = singleUpload.imagePath
				}
			}, media)
		}
		const item = {
			owner_id: client.auth.user.id,
			name: data.name,
			media,
			content: data.content,
			sourceCategory: data.sourceCategory,
			sourceIdentifier: data.sourceIdentifier
		}

		// const response = await itemsCollection.insertOne(newItem)
		// const newlyCreatedItem = await itemsCollection.findOne({
		// 	_id: new BSON.ObjectId(response.insertedId)
		// })
		await client.auth.loginWithCredential(credential)
		const response = await client.callFunction('addItem', [item])
		// console.log(response) // null
		return {
			statusCode: 200,
			headers,
			body: JSON.stringify(response)
		}
	} catch (error) {
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify(error)
		}
	}
}
