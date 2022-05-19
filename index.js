import AWS from "aws-sdk"

const db = new AWS.DynamoDB.DocumentClient()

async function postDocument(id, body, contentType) {
  return await db.put({
    TableName: "documents",
    TimeToLive: 3600,
    Item: { id, body, contentType }
  }).promise()
}

async function getDocument(id) {
  return await db.get({
    TableName: "documents",
    Key: { id }
  }).promise()
}

export async function get(event) {

  console.debug(event)
  const document = (await getDocument(event.queryStringParameters.q)).Item

  if (document) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": document.contentType
      },
      body: document.body
    }
  } else {
    return {
      statusCode: 404
    }
  }
}

export async function post(event) {

  console.debug(event)
  postDocument(event.queryStringParameters.q, event.body, event.headers["Content-Type"] ?? "raw")

  return {
    statusCode: 200
  }
}
