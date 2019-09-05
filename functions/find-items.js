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
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

RegExp.escape = function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};

exports.handler = async (event, context, callback) => {

  try {
    context.callbackWaitsForEmptyEventLoop = false;

    const items = await processEvent(event, context, callback);
    // console.log(items);
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
  
  if (event.body !== null && event.body !== undefined) {
      jsonContents = JSON.parse(event.body);
  }

  const searchTerms = jsonContents.searchTerms;
  const sanitizedSearchQuery = RegExp.escape(searchTerms);
  const searchRegex = new RegExp(sanitizedSearchQuery, "i");

  let skipAmount = 0;
  if (jsonContents.skip) {
    skipAmount = jsonContents.skip;
  }

  try {
    const itemsCollection = db.collection("items");
    
    const items = await itemsCollection
      .find({ content: searchRegex }, { score: { $meta: "textScore" } })
      // .sort({ score: { $meta: "textScore" } })
      .toArray();
    
    /*
    const pipeline = [{ $match: { content: { $regex: searchTerms, $options: 'i' } } }, { $sort: { $score: { $meta: "textScore" } } }, { $limit: 10 }];
    const items = await itemsCollection.aggregate(pipeline).toArray();
    */

    return items;

  } catch (error) {
    return error;
  }
}