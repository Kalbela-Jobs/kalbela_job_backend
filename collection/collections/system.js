const { client } = require("../uri");

const package_collection = client.db('system_collection').collection("packages");
const jobs_collection = client.db('jobs').collection("job_information");
const govt_jobs_collection = client.db('jobs').collection("govt_job_information");
const workspace_collection = client.db('organization').collection("workspace");
const category_collection = client.db('system_collection').collection("categories");
const govt_category_collection = client.db('system_collection').collection("govt_categories");
const mega_category_collection = client.db('system_collection').collection("mega_category");
const job_type_collection = client.db('system_collection').collection("job_type");
const resource_category_collection = client.db('system_collection').collection("resource_categorys");
const search_history_collection = client.db('system_collection').collection("search_history");


module.exports = { package_collection, jobs_collection, govt_jobs_collection, workspace_collection, category_collection, mega_category_collection, job_type_collection, resource_category_collection, search_history_collection, govt_category_collection };
