const { client } = require("../uri");

const resource_collection = client.db('content').collection("resource");
const skill_collection = client.db('content').collection("skills");
const location_collection = client.db('content').collection("location");
const position_collection = client.db('content').collection("position");
const department_collection = client.db('content').collection("department");
const industry_collection = client.db('content').collection("industry");

module.exports = { resource_collection, skill_collection, location_collection, position_collection, department_collection, industry_collection };
