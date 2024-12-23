const { client } = require("../uri");

const apply_jobs_collection = client.db('user_activity').collection("apply_jobs");
const save_jobs_collection = client.db('user_activity').collection("save_jobs");


module.exports = { apply_jobs_collection, save_jobs_collection };
