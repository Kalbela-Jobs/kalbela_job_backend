const { client } = require("../uri");

const package_collection = client.db('system_collection').collection("packages");
const jobs_collection = client.db('jobs').collection("job_information");


module.exports = { package_collection, jobs_collection };
