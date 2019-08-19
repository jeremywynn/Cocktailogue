var ImageKit = require("imagekit");
require("dotenv").config();

import {
  Stitch,
  RemoteMongoClient,
  BSON,
  UserApiKeyCredential
} from "mongodb-stitch-server-sdk";

const client = Stitch.initializeDefaultAppClient("catalogue-fjarv");
const mongoClient = client.getServiceClient(
  RemoteMongoClient.factory,
  "mongodb-atlas"
);

const credential = new UserApiKeyCredential(process.env.MONGODB_API_KEY);

var imagekit = new ImageKit({
  imagekitId: "94ka2dfnz",
  apiKey: process.env.IMAGEKIT_PUBLIC_API_KEY,
  apiSecret: process.env.IMAGEKIT_API_SECRET
});

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

exports.handler = async (event, context, callback) => {
  try {
    const data = JSON.parse(event.body);
    const media = data.media;
    let mediaToDelete = [];

    if (media) {
      media.forEach(function(singleMedia) {
        if (singleMedia.path) {
          mediaToDelete.push(singleMedia.path);
        }
      });
    }

    if (mediaToDelete) {
      let deletePromises = mediaToDelete.map(async function(mediaItemPath) {
        try {
          let deletePromise = await imagekit.deleteFile(mediaItemPath);
          return deletePromise;
        } catch (err) {
          console.log(err);
        }
      });
      await Promise.all(deletePromises);
    }

    await client.auth.loginWithCredential(credential);
    const db = mongoClient.db("catalogue");
    const itemsCollection = db.collection("items");

    const response = await itemsCollection.deleteOne({
      _id: new BSON.ObjectId(data.ID)
    });

    // console.log(response);
    // { deletedCount: 1 }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.log(error); // output to netlify function log
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify(error)
    };
  }
};
