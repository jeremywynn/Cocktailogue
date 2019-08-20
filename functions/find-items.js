require("dotenv").config();

import {
  Stitch,
  RemoteMongoClient,
  UserApiKeyCredential
} from "mongodb-stitch-server-sdk";

const client = Stitch.initializeDefaultAppClient("catalogue-fjarv");
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
    const data = JSON.parse(event.body);
    const searchTerms = data.searchTerms;
    const sanitizedSearchQuery = RegExp.escape(searchTerms);
    const searchRegex = new RegExp(sanitizedSearchQuery, "i");

    await client.auth.loginWithCredential(credential);
    const db = mongoClient.db("catalogue");
    const itemsCollection = db.collection("items");
    const items = await itemsCollection
      .find({ content: searchRegex }, { score: { $meta: "textScore" } })
      // .sort({ score: { $meta: "textScore" } })
      .toArray();
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
