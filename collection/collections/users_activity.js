const { client } = require("../uri");

const apply_jobs_collection = client.db('user_activity').collection("apply_jobs");
const save_jobs_collection = client.db('user_activity').collection("save_jobs");
const resume_collection = client.db('user_activity').collection("resume");
const education_collection = client.db('user_activity').collection("education");
const certification_collection = client.db('user_activity').collection("certification");
const user_skill_collection = client.db('user_activity').collection("skills");
const experience_collection = client.db('user_activity').collection("experience");
const chat_collection = client.db('chat').collection("employer_chat");


module.exports = { apply_jobs_collection, save_jobs_collection, resume_collection, education_collection, certification_collection, user_skill_collection, experience_collection, chat_collection };
