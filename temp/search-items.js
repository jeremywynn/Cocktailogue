require("dotenv").config();
import faunadb from "faunadb";

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
});

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

exports.handler = async (event, context, callback) => {
  try {
    const response = await client.query(
      // q.Paginate(q.Match(q.Index("items_by_source"), "Instagram"))
      q.Paginate(q.Match(q.Index("items_by_source"), "Instagram"))
    );
    if (!response.data) {
      console.log("NO RESPONSE DATA!");
    }
    const itemRefs = await response.data;
    const getAllItemDataQuery = itemRefs.map(ref => {
      return q.Get(ref);
    });
    return client.query(getAllItemDataQuery).then(ret => {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(ret)
      };
    });
  } catch (error) {
    console.log(error); // output to netlify function log
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify(error)
    };
  }
};
