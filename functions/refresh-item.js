require("dotenv").config();

import {
  Stitch,
  StitchAppClientConfiguration,
  BSON,
  RemoteMongoClient,
  UserApiKeyCredential
} from "mongodb-stitch-server-sdk";

// const client = Stitch.initializeDefaultAppClient(
//   "catalogue-fjarv",
//   new StitchAppClientConfiguration.Builder().withDataDirectory("/tmp").build()
// );
const client = Stitch.initializeDefaultAppClient(
  "catalogue-fjarv",
  new StitchAppClientConfiguration.Builder().withDataDirectory("").build()
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
    const id = JSON.parse(event.body);

    const query = { _id: new BSON.ObjectId(id) };
    const options = { limit: 1 };

    await client.auth.loginWithCredential(credential);
    const db = mongoClient.db("catalogue");
    const itemsCollection = db.collection("items");
    const item = await itemsCollection.findOne(query, options);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(item)
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
