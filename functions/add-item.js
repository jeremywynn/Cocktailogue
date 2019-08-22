var ImageKit = require("imagekit");
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
    let media = data.media;

    if (media) {
      let uploadPromises = media.map(async function(mediaItem) {
        try {
          let uploadPromise = await imagekit.uploadViaURL(mediaItem.url, {
            filename: mediaItem.id,
            folder: "/"
          });
          return uploadPromise;
        } catch (err) {
          // Tenuous, e.g. Instagram's asset URLs are temporary
          return mediaItem;
        }
      });

      let uploadedMedia = await Promise.all(uploadPromises);
      uploadedMedia.forEach(function(singleUpload, index) {
        if (singleUpload.imagePath) {
          this[index].path = singleUpload.imagePath;
        }
      }, media);

      await client.auth.loginWithCredential(credential);
      const db = mongoClient.db("catalogue");
      const itemsCollection = db.collection("items");

      let newItem = {
        owner_id: client.auth.user.id,
        name: data.name,
        media: media,
        content: data.content,
        sourceCategory: data.sourceCategory,
        sourceIdentifier: data.sourceIdentifier
      };

      const response = await itemsCollection.insertOne(newItem);
      const newlyCreatedItem = await itemsCollection.findOne({
        _id: new BSON.ObjectId(response.insertedId)
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(newlyCreatedItem)
      };
    } else {
      await client.auth.loginWithCredential(credential);
      const db = mongoClient.db("catalogue");
      const itemsCollection = db.collection("items");

      let newItem = {
        owner_id: client.auth.user.id,
        name: data.name,
        media: media,
        content: data.content,
        sourceCategory: data.sourceCategory,
        sourceIdentifier: data.sourceIdentifier
      };

      const response = await itemsCollection.insertOne(newItem);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response)
      };
    }
  } catch (error) {
    console.log(error); // output to netlify function log
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify(error)
    };
  }
};
