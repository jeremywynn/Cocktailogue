import {
  Stitch,
  StitchAppClientConfiguration,
  RemoteMongoClient,
  BSON,
  UserApiKeyCredential
} from "mongodb-stitch-server-sdk";

const ImageKit = require("imagekit");
require("dotenv").config();

let cachedDb = null;
let dataDirectory = "";

const isLambda = !!(process.env.LAMBDA_TASK_ROOT || false);

if (isLambda) {
  dataDirectory = "/tmp";
}

const client = Stitch.initializeDefaultAppClient(
  process.env.MONGODB_STITCH_APP_ID,
  new StitchAppClientConfiguration.Builder()
    .withDataDirectory(dataDirectory)
    .build()
);
const mongoClient = client.getServiceClient(
  RemoteMongoClient.factory,
  "mongodb-atlas"
);
const credential = new UserApiKeyCredential(process.env.MONGODB_API_KEY);

const imagekit = new ImageKit({
  imagekitId: process.env.IMAGEKIT_ID,
  apiKey: process.env.IMAGEKIT_PUBLIC_API_KEY,
  apiSecret: process.env.IMAGEKIT_API_SECRET
});

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

exports.handler = async (event, context, callback) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;

    const response = await processEvent(event, context, callback);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(error)
    };
  }
};

async function connectToDatabase(uri) {
  try {
    if (cachedDb && typeof cachedDb.serverConfig !== "undefined") {
      if (cachedDb.serverConfig.isConnected()) {
        return Promise.resolve(cachedDb);
      }
    }
    await client.auth.loginWithCredential(credential);
    const db = mongoClient.db("catalogue");
    cachedDb = db;
    return cachedDb;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function processEvent(event, context, callback) {
  try {
    const db = await connectToDatabase();
    const result = await queryDatabase(db, event);
    return result;
  } catch (error) {
    console.log(error); // output to netlify function log
    return error;
  }
}

async function queryDatabase(db, event) {
  let jsonContents = JSON.parse(JSON.stringify(event));

  if (event.body !== null && event.body !== undefined) {
    jsonContents = JSON.parse(event.body);
  }

  const data = jsonContents;
  const media = data.media;

  try {
    if (media) {
      const uploadPromises = media.map(async function(mediaItem) {
        try {
          const uploadPromise = await imagekit.uploadViaURL(mediaItem.url, {
            filename: mediaItem.id,
            folder: "/"
          });
          return uploadPromise;
        } catch (err) {
          // Tenuous, e.g. Instagram's asset URLs are temporary
          return mediaItem;
        }
      });

      const uploadedMedia = await Promise.all(uploadPromises);
      uploadedMedia.forEach(function(singleUpload, index) {
        if (singleUpload.imagePath) {
          this[index].path = singleUpload.imagePath;
        }
      }, media);

      const itemsCollection = db.collection("items");

      const newItem = {
        owner_id: client.auth.user.id,
        name: data.name,
        media,
        content: data.content,
        sourceCategory: data.sourceCategory,
        sourceIdentifier: data.sourceIdentifier
      };

      const response = await itemsCollection.insertOne(newItem);
      const newlyCreatedItem = await itemsCollection.findOne({
        _id: new BSON.ObjectId(response.insertedId)
      });

      return newlyCreatedItem;
    } else {
      const itemsCollection = db.collection("items");

      const newItem = {
        owner_id: client.auth.user.id,
        name: data.name,
        media,
        content: data.content,
        sourceCategory: data.sourceCategory,
        sourceIdentifier: data.sourceIdentifier
      };

      const response = await itemsCollection.insertOne(newItem);
      return response;
    }
  } catch (error) {
    return error;
  }
}
