require("dotenv").config();

import {
  Stitch,
  StitchAppClientConfiguration,
  RemoteMongoClient,
  UserApiKeyCredential
} from "mongodb-stitch-server-sdk";

const client = Stitch.initializeDefaultAppClient(
  "catalogue-fjarv",
  new StitchAppClientConfiguration.Builder().withDataDirectory("/tmp").build()
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
    await client.auth.loginWithCredential(credential);
    const db = mongoClient.db("catalogue");
    const itemsCollection = db.collection("items");
    const items = await itemsCollection.find({}, { limit: 50 }).toArray();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(items)
    };
  } catch (error) {
    console.log(error); // output to netlify function log
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(error)
    };
  }
};
