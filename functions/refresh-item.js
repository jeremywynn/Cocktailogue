import {
  Stitch,
  StitchAppClientConfiguration,
  BSON,
  RemoteMongoClient,
  UserApiKeyCredential
} from "mongodb-stitch-server-sdk";

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

  const query = { _id: new BSON.ObjectId(jsonContents) };
  const options = { limit: 1 };

  try {
    const itemsCollection = db.collection("items");
    const item = await itemsCollection.findOne(query, options);
    return item;
  } catch (error) {
    return error;
  }
}
