const { ObjectId } = require("mongodb");
const { audio_collection } = require("../../collection/collections/image_collection");
const { response_sender } = require("../hooks/respose_sender");

const upload_audio = async (req, res, next) => {
      try {
            const audioBuffer = req.file.buffer;
            const mimeType = req.file.mimetype;
            const audio_title = req.body?.title;

            if (!mimeType.startsWith("audio/")) {
                  return res.status(400).json({ error: "Unsupported audio format" });
            }

            let data = {
                  audio: audioBuffer,
                  fileType: mimeType,
                  createdAt: new Date(),
            };

            if (audio_title) data.title = audio_title;
            const result = await audio_collection.insertOne(data);
            const fileExtension = mimeType.split("/")[1];
            const file_url = `https://image.kalbelajobs.com/api/v1/image/get-audio/${result.insertedId}.${fileExtension}`;

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Audio uploaded successfully",
                  data: { audio_url: file_url },
            });
      } catch (err) {
            next(err);
      }
};

const get_audio_by_id = async (req, res, next) => {
      try {
            let audioId = req.params.id.replace(/\.[^/.]+$/, "");

            const audioDoc = await audio_collection.findOne({ _id: new ObjectId(audioId) });
            if (!audioDoc) return res.status(404).json({ error: "Audio not found" });
            res.contentType(audioDoc.fileType || 'audio/mpeg');
            return res.status(200).send(Buffer.from(audioDoc.audio.buffer, 'base64'));
      } catch (err) {
            console.error('Server error:', err);
            return res.status(500).json({ error: "Internal server error" });
      }
};

module.exports = {
      upload_audio,
      get_audio_by_id
}
