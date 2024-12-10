const { client } = require("../uri");

const user_collection = client.db('users').collection("all_users");
const password_backup = client.db('backup').collection('password')


module.exports = { user_collection, password_backup };
