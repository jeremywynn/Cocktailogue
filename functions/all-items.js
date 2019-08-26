require("dotenv").config();

import {
  Stitch,
  StitchAppClientConfiguration,
  RemoteMongoClient,
  UserApiKeyCredential
} from "mongodb-stitch-server-sdk";

// const environment = process.env.NODE_ENV || "development";

// console.log(environment);

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

exports.handler = async (event, context, callback) => {
  try {
    const data = JSON.parse(event.body);
    let skipAmount = 0;
    if (data.skip) {
      skipAmount = data.skip;
    }
    await client.auth.loginWithCredential(credential);
    const db = mongoClient.db("catalogue");
    const itemsCollection = db.collection("items");
    // const itemsCount = await itemsCollection.count();
    // console.log(itemsCount);

    // skipAmount 1040

    const pipeline = [{ $skip: skipAmount }, { $limit: 100 }];
    const items = await itemsCollection.aggregate(pipeline).toArray();

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
