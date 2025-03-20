const express = require("express");
const multer = require("multer");
const { MongoClient, GridFSBucket, ObjectId } = require("mongodb");
const { response_sender } = require("../../modules/hooks/respose_sender");
require("dotenv").config();

const router = express.Router();

// MongoDB Configuration
const mongoURI = process.env.MONGO_URI;
const DB_NAME = "images"; // Ensure this database exists

const client = new MongoClient(mongoURI);
let gridFSBucket;

// ✅ Connect to MongoDB
async function connectDB() {
      try {
            await client.connect();
            const db = client.db(DB_NAME);
            gridFSBucket = new GridFSBucket(db, { bucketName: "uploads" });
            console.log("✅ Connected to MongoDB");
      } catch (err) {
            console.error("❌ MongoDB Connection Failed:", err);
            process.exit(1);
      }
}
connectDB();

const ensureDBConnection = (req, res, next) => {
      if (!gridFSBucket) {
            return response_sender({
                  res,
                  status_code: 500,
                  error: true,
                  message: "Database connection not ready",
                  data: null,
            });
      }
      next();
};


const upload = multer({ storage: multer.memoryStorage() });


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
            uploadStream.end(buffer);

            uploadStream.on("error", (err) => {
                  console.error("❌ Upload Stream Error:", err);
                  next(err);
            });

            uploadStream.on("finish", async () => {
                  const file_url = `https://server.kalbelajobs.com/api/v2/image/${uploadStream.id}.${ext}`;
                  const db = client.db(DB_NAME);
                  const image_collection = db.collection("image_collection");

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
            console.error("❌ Upload Error:", error);
            next(error);
      }
};


const get_image_by_id_v2 = async (req, res, next) => {
      try {
            let imageId = req.params.id.replace(/\.[^/.]+$/, "");

            if (!ObjectId.isValid(imageId)) {
                  return response_sender({
                        res,
                        status_code: 400,
                        error: true,
                        message: "Invalid Image ID",
                        data: null,
                  });
            }

            const db = client.db(DB_NAME);
            const image_collection = db.collection("image_collection");
            const imageDoc = await image_collection.findOne({ file_id: new ObjectId(imageId) });

            if (!imageDoc) {
                  return response_sender({
                        res,
                        status_code: 404,
                        error: true,
                        message: "Image not found",
                        data: null,
                  });
            }

            res.contentType(imageDoc.file_type || "image/jpeg");

            if (imageDoc.file_type === "application/pdf") {
                  res.setHeader("Content-Disposition", 'inline; filename="document.pdf"');
            }

            const downloadStream = gridFSBucket.openDownloadStream(new ObjectId(imageId));

            downloadStream.on("error", (err) => {
                  console.error("❌ File Read Error:", err);
                  return response_sender({
                        res,
                        status_code: 500,
                        error: true,
                        message: "Error reading file",
                        data: { details: err.message },
                  });
            });

            downloadStream.pipe(res);
      } catch (error) {
            console.error("❌ Fetch Error:", error);
            next(error);
      }
};

// ✅ Define Routes
router.get("/:id", ensureDBConnection, get_image_by_id_v2);
router.put("/upload-image", ensureDBConnection, upload.single("image"), upload_image_v2);

module.exports = router;
