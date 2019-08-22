// var ImageKit = require("imagekit");
require("dotenv").config();

import {
  Stitch,
  StitchAppClientConfiguration,
  RemoteMongoClient,
  BSON,
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

// var imagekit = new ImageKit({
//   imagekitId: "94ka2dfnz",
//   apiKey: process.env.IMAGEKIT_PUBLIC_API_KEY,
//   apiSecret: process.env.IMAGEKIT_API_SECRET
// });

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

exports.handler = async (event, context, callback) => {
  try {
    const data = JSON.parse(event.body);
    const query = {
      _id: new BSON.ObjectId(data.ID)
    };
    const update = {
      $set: {
        name: data.name,
        content: data.content
      }
    };
    const options = { upsert: false };

    await client.auth.loginWithCredential(credential);
    const db = mongoClient.db("catalogue");
    const itemsCollection = db.collection("items");

    const response = await itemsCollection.updateOne(query, update, options);
    // const { matchedCount, modifiedCount } = response;
    // if (matchedCount && modifiedCount) {
    //   const editedItem = await itemsCollection.findOne({
    //     _id: new BSON.ObjectId(data.ID)
    //   });
    //   return {
    //     statusCode: 200,
    //     headers,
    //     body: JSON.stringify(editedItem)
    //   };
    // }
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
    // Throw error here?
  } catch (error) {
    console.log(error); // output to netlify function log
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify(error)
    };
  }
};
