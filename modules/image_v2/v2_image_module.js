const { MongoClient, ObjectId } = require("mongodb");
const Grid = require("gridfs-stream");
const multer = require("multer");
const { response_sender } = require("../../modules/hooks/respose_sender");



// ✅ **Upload Image**
const upload_image_v2 = async (req, res, next) => {
      if (!req.file) {
            return response_sender({
                  res,
                  status_code: 400,
                  error: true,
                  message: "No file uploaded",
                  data: null,
            });
      }

      try {
            const { originalname, buffer, mimetype } = req.file;
            const ext = originalname.split(".").pop();
            const uploadStream = gridFSBucket.openUploadStream(originalname, { contentType: mimetype });

            // Save file to GridFS
            uploadStream.end(buffer);

            uploadStream.on("finish", async () => {
                  const file_url = `https://image.kalbelajobs.com/api/v1/image/${uploadStream.id}.${ext}`;

                  // Save File Info in `image_collection`
                  await image_collection.insertOne({
                        file_id: uploadStream.id,
                        file_name: originalname,
                        file_type: mimetype,
                        file_url,
                        created_at: new Date(),
                  });

                  response_sender({
                        res,
                        status_code: 200,
                        error: false,
                        message: "File uploaded successfully",
                        data: { image_url: file_url },
                  });
            });
      } catch (error) {
            next(error);
      }
};


const get_image_by_id_v2 = async (req, res, next) => {
      try {
            const fileId = req.params.id.split(".")[0];
            const downloadStream = gridFSBucket.openDownloadStream(new MongoClient.ObjectId(fileId));
            downloadStream.pipe(res);
      } catch (error) {
            next(error);
      }
};


module.exports = { upload_image_v2, get_image_by_id_v2 };
