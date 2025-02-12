const { client } = require("../uri");

const image_collection = client.db('storage').collection("images");
const audio_collection = client.db('storage').collection("audios");


module.exports = { image_collection, audio_collection };
