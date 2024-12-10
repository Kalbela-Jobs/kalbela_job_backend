const { client } = require("../uri");

const package_collection = client.db('system_collection').collection("packages");


module.exports = { package_collection };
