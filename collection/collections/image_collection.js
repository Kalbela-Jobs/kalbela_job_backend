const { client } = require("../uri");

const image_collection = client.db('storage').collection("images");
const audio_collection = client.db('storage').collection("audios");
const audio_collection1 = client.db('storage').collection("audios1");
const image_collection1 = client.db('storage').collection("images1");


module.exports = { image_collection, audio_collection, audio_collection1, image_collection1 };
