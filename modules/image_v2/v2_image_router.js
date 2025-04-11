const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { MongoClient, GridFSBucket, ObjectId } = require("mongodb");
const { response_sender } = require("../../modules/hooks/respose_sender");
require("dotenv").config();

const router = express.Router();

// MongoDB Configuration
const mongoURI = process.env.MONGO_URI;
const DB_NAME = "images";

const client = new MongoClient(mongoURI);
let gridFSBucket;

// Connect to MongoDB
client.connect().then(() => {
      const db = client.db(DB_NAME);
      gridFSBucket = new GridFSBucket(db, { bucketName: "uploads" });

}).catch((err) => {
      console.error("❌ MongoDB Connection Failed:", err);
});

// Ensure Upload Directory Exists
const UPLOADS_DIR = path.join(__dirname, "../../uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Setup for Disk Storage
const storage = multer.diskStorage({
      destination: (req, file, cb) => {
            cb(null, UPLOADS_DIR);
      },
      filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${Date.now()}-${file.fieldname}${ext}`);
      },
});

const upload = multer({ storage });

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
            const { originalname, mimetype, path: filePath } = req.file;
            const ext = path.extname(originalname);

            if (!gridFSBucket) {
                  return response_sender({
                        res,
                        status_code: 500,
                        error: true,
                        message: "Database connection not ready",
                        data: null,
                  });
            }

            // Upload file to GridFS
            const uploadStream = gridFSBucket.openUploadStream(originalname, { contentType: mimetype });
            fs.createReadStream(filePath).pipe(uploadStream);

            uploadStream.on("finish", async () => {
                  const file_url = `https://server.kalbelajobs.com/api/v2/image/${uploadStream.id}${ext}`;

                  const db = client.db(DB_NAME);
                  const image_collection = db.collection("image_collection");

                  await image_collection.insertOne({
                        file_id: uploadStream.id,
                        file_name: originalname,
                        file_type: mimetype,
                        file_url,
                        created_at: new Date(),
                  });

                  // Remove local file after upload
                  fs.unlinkSync(filePath);

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

// ✅ **Get Image by ID**
const get_image_by_id_v2 = async (req, res, next) => {
      try {
            let imageId = req.params.id;
            imageId = imageId.replace(/\.[^/.]+$/, ""); // Remove file extension if present

            if (!ObjectId.isValid(imageId)) {
                  return res.status(400).json({ error: "Invalid Image ID" });
            }

            if (!gridFSBucket) {
                  return res.status(500).json({ error: "Database connection not ready" });
            }

            const db = client.db(DB_NAME);
            const image_collection = db.collection("image_collection");

            const imageDoc = await image_collection.findOne({ file_id: new ObjectId(imageId) });

            if (!imageDoc) {
                  return res.status(404).json({ error: "Image not found" });
            }

            res.contentType(imageDoc.file_type || "image/jpeg");

            if (imageDoc.file_type === "application/pdf") {
                  res.setHeader("Content-Disposition", 'inline; filename="document.pdf"');
            }

            const downloadStream = gridFSBucket.openDownloadStream(new ObjectId(imageId));

            downloadStream.on("error", (err) => {
                  return res.status(500).json({ error: "Error reading file", details: err.message });
            });

            downloadStream.pipe(res);
      } catch (error) {
            console.error("❌ Fetch Error:", error);
            next(error);
      }
};

// Define Routes
router.get("/:id", get_image_by_id_v2);
router.put("/upload-image", upload.single("image"), upload_image_v2);

module.exports = router;
