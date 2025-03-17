const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { response_sender } = require("../hooks/respose_sender");

const router = express.Router();

const imageDir = path.join(__dirname, "../../assets/images");
const audioDir = path.join(__dirname, "../../assets/audio");
const tempDir = path.join(__dirname, "../../assets/temp");

// Create directories if they don't exist
[imageDir, audioDir, tempDir].forEach(dir => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const getNextFilename = (dir, extension) => {
      const files = fs.readdirSync(dir)
            .filter(file => file.match(/^\d+\.[a-zA-Z]+$/))
            .map(file => parseInt(file.split(".")[0]))
            .sort((a, b) => a - b);

      const nextNumber = files.length > 0 ? files[files.length - 1] + 1 : 1;
      return `${nextNumber}.${extension}`;
};

const getNextAudioFilename = (dir) => {
      const files = fs.readdirSync(dir)
            .filter(file => file.match(/^\d+\.mp3$/))
            .map(file => parseInt(file.split(".")[0]))
            .sort((a, b) => a - b);

      const nextNumber = files.length > 0 ? files[files.length - 1] + 1 : 1;
      return `${nextNumber}.mp3`;
};

// Use disk storage instead of memory storage
const imageStorage = multer.diskStorage({
      destination: function (req, file, cb) {
            cb(null, tempDir);
      },
      filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
      }
});

const audioStorage = multer.diskStorage({
      destination: function (req, file, cb) {
            cb(null, tempDir);
      },
      filename: function (req, file, cb) {
            cb(null, Date.now() + '.mp3');
      }
});

const uploadImage = multer({
      storage: imageStorage,
      limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

const uploadAudio = multer({
      storage: audioStorage,
      limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

// Move file using streams instead of copying buffer
const moveFile = (sourcePath, destDir, destFilename) => {
      return new Promise((resolve, reject) => {
            const destPath = path.join(destDir, destFilename);
            const readStream = fs.createReadStream(sourcePath);
            const writeStream = fs.createWriteStream(destPath);

            readStream.on('error', reject);
            writeStream.on('error', reject);
            writeStream.on('finish', () => {
                  // Remove the temp file after successful move
                  fs.unlink(sourcePath, (err) => {
                        if (err) console.error('Failed to delete temp file:', err);
                        resolve(destPath);
                  });
            });

            // Pipe the file stream
            readStream.pipe(writeStream);
      });
};

router.put("/upload-image", uploadImage.single("image"), async (req, res, next) => {
      try {
            if (!req.file) return res.status(400).json({ error: "No image file uploaded" });

            const extension = path.extname(req.file.originalname).slice(1);
            const nextFilename = getNextFilename(imageDir, extension);

            // Move the file from temp to final destination
            await moveFile(req.file.path, imageDir, nextFilename);

            const fileUrl = `https://image.kalbelajobs.com/api/v2/image/${nextFilename}`;
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Image uploaded successfully",
                  data: { image_url: fileUrl },
            });
      } catch (error) {
            next(error);
      }
});

router.get("/:filename", (req, res) => {
      const filePath = path.join(imageDir, req.params.filename);
      if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Image not found" });

      res.sendFile(filePath);
});

router.put("/upload-audio", uploadAudio.single("audio"), async (req, res, next) => {
      try {
            if (!req.file) return res.status(400).json({ error: "No audio file uploaded" });

            const nextFilename = getNextAudioFilename(audioDir);

            // Move the file from temp to final destination
            await moveFile(req.file.path, audioDir, nextFilename);

            const fileUrl = `https://image.kalbelajobs.com/api/v2/image/get-audio/${nextFilename}`;
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Audio uploaded successfully",
                  data: { audio_url: fileUrl },
            });
      } catch (error) {
            next(error);
      }
});

router.get("/get-audio/:filename", (req, res) => {
      const filePath = path.join(audioDir, req.params.filename);
      if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Audio not found" });

      res.sendFile(filePath);
});

module.exports = router;
