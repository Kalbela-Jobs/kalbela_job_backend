const { client } = require("../uri");

const resource_collection = client.db('content').collection("resource");

module.exports = { resource_collection };
