import AWS from "aws-sdk"

const db = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.TABLE_NAME

async function postDocument(id, body, contentType) {
  return await db.put({
    TableName: tableName,
    Item: { id, body, contentType, expiredAt: Math.floor(Date.now() / 1000) + 3600 }
  }).promise()
}

async function getDocument(id) {
  return await db.get({
    TableName: tableName,
    Key: { id }
  }).promise()
}

export async function get(event) {

  console.debug(JSON.stringify(event))

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

  console.debug(JSON.stringify(event))

  const contentType = event.headers[Object.keys(event.headers).find(it => it.toLowerCase() === "content-type")]
  await postDocument(event.queryStringParameters.q, event.body, contentType ?? "raw")

  return {
    statusCode: 200
  }
}
