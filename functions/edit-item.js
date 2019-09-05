// var ImageKit = require("imagekit");
require("dotenv").config();

import {
  Stitch,
  StitchAppClientConfiguration,
  RemoteMongoClient,
  BSON,
  UserApiKeyCredential
} from "mongodb-stitch-server-sdk";

let cachedDb = null;
let dataDirectory = '';

const isLambda = !!(process.env.LAMBDA_TASK_ROOT || false);

if (isLambda) {
  dataDirectory = '/tmp';
}

const client = Stitch.initializeDefaultAppClient(
  process.env.MONGODB_STITCH_APP_ID,
  new StitchAppClientConfiguration.Builder().withDataDirectory(dataDirectory).build()
);
const mongoClient = client.getServiceClient(
  RemoteMongoClient.factory,
  "mongodb-atlas"
);
const credential = new UserApiKeyCredential(process.env.MONGODB_API_KEY);

// var imagekit = new ImageKit({
//   imagekitId: process.env.IMAGEKIT_ID,
//   apiKey: process.env.IMAGEKIT_PUBLIC_API_KEY,
//   apiSecret: process.env.IMAGEKIT_API_SECRET
// });

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
    if (cachedDb && (typeof cachedDb.serverConfig != 'undefined')) {
      if (cachedDb.serverConfig.isConnected()) {
        return Promise.resolve(cachedDb);
      }
    }
    await client.auth.loginWithCredential(credential);
    const db = mongoClient.db("catalogue");
    cachedDb = db;
    return cachedDb;
  }
  catch (error) {
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
  var jsonContents = JSON.parse(JSON.stringify(event));
  
  if (event.body !== null && event.body !== undefined) {
      jsonContents = JSON.parse(event.body);
  }

  const query = {
    _id: new BSON.ObjectId(jsonContents.ID)
  };
  const update = {
    $set: {
      name: jsonContents.name,
      content: jsonContents.content
    }
  };
  const options = { upsert: false };

  try {
    const itemsCollection = db.collection("items");
    const response = await itemsCollection.updateOne(query, update, options);
    return response;
  } catch (error) {
    return error;
  }
}
