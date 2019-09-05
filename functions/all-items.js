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
  "catalogue-fjarv",
  new StitchAppClientConfiguration.Builder().withDataDirectory(dataDirectory).build()
);
const mongoClient = client.getServiceClient(
  RemoteMongoClient.factory,
  "mongodb-atlas"
);
const credential = new UserApiKeyCredential(process.env.MONGODB_API_KEY);

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

exports.handler = async (event, context, callback) => {

  try {
    context.callbackWaitsForEmptyEventLoop = false;

    const items = await processEvent(event, context, callback);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(items)
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
  // const data = JSON.parse(event.body);
  
  if (event.body !== null && event.body !== undefined) {
    jsonContents = JSON.parse(event.body);
  }

  let skipAmount = 0;

  try {
    let pipeline = [{$sort: {"_id": -1} }, { $skip: skipAmount }, { $limit: 20 }];
    if (jsonContents.skip) {
      let oid = new BSON.ObjectId(jsonContents.skip);
      pipeline = [{$match: {_id: {$lt: oid}}}, {$sort: {"_id": -1} }, { $limit: 20 }];
    }
    const itemsCollection = db.collection("items");
    const items = await itemsCollection.aggregate(pipeline).toArray();
    return items;
  } catch (error) {
    return error;
  }
}