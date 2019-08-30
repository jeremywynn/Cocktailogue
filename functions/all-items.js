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



const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

exports.handler = async (event, context, callback) => {
  let dataDirectory = '';

  if (Object.entries(context.clientContext).length != 0) {
    dataDirectory = '/tmp';
  }

  const client = Stitch.initializeDefaultAppClient(
    "catalogue-fjarv",
    new StitchAppClientConfiguration.Builder().withDataDirectory(dataDirectory).build()
  );

  const mongoClient = client.getServiceClient(
    RemoteMongoClient.factory,
    "mongodb-atlas"
  );

  const credential = new UserApiKeyCredential(process.env.MONGODB_API_KEY);

  try {
    const data = JSON.parse(event.body);
    // let skipAmount = 18;
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

    const pipeline = [{$sort: {"_id": -1} }, { $skip: skipAmount }, { $limit: 10 }];
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
