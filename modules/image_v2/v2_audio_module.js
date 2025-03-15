const path = require("path");
const fs = require("fs");

// Define audio directory
const audioDirectory = path.join(__dirname, "../../collection/assets/audio");

// Ensure the directory exists
if (!fs.existsSync(audioDirectory)) {
      fs.mkdirSync(audioDirectory, { recursive: true });
}

// Function to sanitize filenames (remove special characters)
const sanitizeFilename = (filename) => {
      return filename.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
};

// Function to get the next available filename (avoid overwriting)
const getNextAudioFilename = (originalName) => {
      const ext = path.extname(originalName);
      const baseName = sanitizeFilename(path.basename(originalName, ext));

      let newFilename = `${baseName}${ext}`;
      let counter = 1;

      while (fs.existsSync(path.join(audioDirectory, newFilename))) {
            newFilename = `${baseName}_${counter}${ext}`;
            counter++;
      }

      return newFilename;
};

// Audio upload function
const upload_audio = async (req, res) => {
      const file = req.file;
      if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
      }

      const fileUrl = `https://image.kalbelajobs.com/api/v2/get-audio/${file.filename}.`;
      res.status(200).json({ message: "Audio uploaded successfully", fileUrl });
};

// Function to get audio file by ID
const get_audio_by_id = async (req, res) => {
      const { id } = req.params;

      // Find files that match the ID
      const files = fs.readdirSync(audioDirectory).filter(file =>
            path.basename(file, path.extname(file)) === id
      );

      if (files.length === 0) {
            return res.status(404).json({ error: "File not found" });
      }

      const file = files[0];
      const fileUrl = `https://image.kalbelajobs.com/api/v2/get-audio/${file}`;

      res.status(200).json({ fileUrl });
};

// Export functions
module.exports = {
      upload_audio,
      get_audio_by_id,
};
