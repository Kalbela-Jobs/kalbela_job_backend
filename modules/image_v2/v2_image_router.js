const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { response_sender } = require("../hooks/respose_sender");

const router = express.Router();

const imageDir = path.join(__dirname, "../../assets/images");
const audioDir = path.join(__dirname, "../../assets/audio");

if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

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

const imageStorage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, imageDir),
      filename: (req, file, cb) => {
            const extension = path.extname(file.originalname).slice(1);
            const nextFilename = getNextFilename(imageDir, extension);
            cb(null, nextFilename);
      }
});

const audioStorage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, audioDir),
      filename: (req, file, cb) => {
            const extension = path.extname(file.originalname).slice(1);
            const nextFilename = getNextAudioFilename(audioDir);
            cb(null, nextFilename);
      }
});

// Set file size limit to 20MB
const uploadImage = multer({
      storage: imageStorage,
      limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

const uploadAudio = multer({
      storage: audioStorage,
      limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

router.put("/upload-image", uploadImage.single("image"), (req, res, next) => {
      try {
            if (!req.file) return res.status(400).json({ error: "No image file uploaded" });

            const fileUrl = `https://image.kalbelajobs.com/api/v2/image/${req.file.filename}`;
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

router.put("/upload-audio", uploadAudio.single("audio"), (req, res, next) => {
      try {
            if (!req.file) return res.status(400).json({ error: "No audio file uploaded" });

            const fileUrl = `https://image.kalbelajobs.com/api/v2/image/get-audio/${req.file.filename}`;
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
