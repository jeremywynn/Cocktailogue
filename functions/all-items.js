require("dotenv").config();

import {
  Stitch,
  StitchAppClientConfiguration,
  RemoteMongoClient,
  UserApiKeyCredential
} from "mongodb-stitch-server-sdk";

//Performance optimization Step 1: declare the database connection object outside the handler method
let cachedDb = null;
let dataDirectory = '/tmp';

if (process.env.CONTEXT) {
  dataDirectory = dataDirectory = '/tmp';
}

console.log(process.env.CONTEXT);
console.log(process.env.NETLIFY);

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
    //Performance optimization Step 2: set context.callbackWaitsForEmptyEventLoop to false to prevent the Lambda function from waiting for all resources (such as the database connection) to be released before returning it
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
    //Performance optimization Step 3: test that database connection exists and is valid
    //before re-using it
    if (cachedDb && (typeof cachedDb.serverConfig != 'undefined')) {
      if (cachedDb.serverConfig.isConnected()) {
        // console.log('=> using cached database instance');
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
  
  //handling API Gateway input where the event is embedded into the 'body' element
  if (event.body !== null && event.body !== undefined) {
      console.log('retrieving payload from event.body');
      jsonContents = JSON.parse(event.body);
  }

  // console.log('query parameters: ', jsonContents);

  let skipAmount = 0;
  if (jsonContents.skip) {
    skipAmount = jsonContents.skip;
  }

  try {
    const itemsCollection = db.collection("items");
    const pipeline = [{$sort: {"_id": -1} }, { $skip: skipAmount }, { $limit: 10 }];
    const items = await itemsCollection.aggregate(pipeline).toArray();

    return items;

  } catch (error) {
    return error;
  }
}