const sharp = require("sharp");
const { PDFDocument } = require('pdf-lib');
const { mysql_image } = require("../../collection/mysql_server/pool");
const { response_sender } = require("../hooks/respose_sender");

const upload_image = async (req, res, next) => {
      try {
            const imageBuffer = req.file.buffer;
            const mimeType = req.file.mimetype;
            const image_title = req.body?.title;

            // Validate supported image formats
            const supportedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/bmp", "image/svg+xml", "application/pdf"];
            if (!supportedFormats.includes(mimeType)) {
                  return res.status(400).json({ error: "Unsupported image format" });
            }

            // Insert image data into MySQL
            mysql_image.query(
                  'INSERT INTO images (title, mime_type, image_data, created_at) VALUES (?, ?, ?, ?)',
                  [image_title, mimeType, imageBuffer, new Date()],
                  (err, result) => {
                        if (err) {
                              console.error('MySQL error:', err);
                              return res.status(500).json({ error: 'Internal server error' });
                        }

                        const fileExtension = mimeType.split("/")[1];
                        const file_url = `https://image.kalbelajobs.com/api/v2/get-image/${result.insertId}.${fileExtension}`;

                        response_sender({
                              res,
                              status_code: 200,
                              error: false,
                              message: "Image uploaded successfully",
                              data: { image_url: file_url },
                        });
                  }
            );
      } catch (err) {
            next(err);
      }
};


const get_image_by_id = async (req, res, next) => {
      try {
            let imageId = req.params.id;

            // Extract only the numeric ID (removing file extension)
            const idMatch = imageId.match(/^(\d+)(\.[^/.]+)?$/);
            if (!idMatch) {
                  return res.status(400).json({ error: "Invalid image ID format" });
            }

            const imageNumericId = idMatch[1];

            // Retrieve image data from MySQL
            mysql_image.query(
                  'SELECT * FROM images WHERE id = ?',
                  [imageNumericId],
                  (err, results) => {
                        if (err) {
                              console.error('MySQL error:', err);
                              return res.status(500).json({ error: 'Internal server error' });
                        }

                        if (results.length === 0) {
                              return res.status(404).json({ error: "Image not found" });
                        }

                        const imageDoc = results[0];
                        const fileExtension = imageDoc.mime_type.split("/")[1];

                        // Validate requested extension matches the stored MIME type
                        if (idMatch[2] && idMatch[2] !== `.${fileExtension}`) {
                              return res.status(400).json({ error: "File extension mismatch" });
                        }

                        // Serve PDF differently
                        if (imageDoc.mime_type === 'application/pdf') {
                              res.contentType('application/pdf');
                              res.setHeader('Content-Disposition', 'inline; filename="document.pdf"');
                              return res.send(imageDoc.image_data);
                        }

                        // Serve Image
                        res.contentType(imageDoc.mime_type || 'image/jpeg');
                        return res.status(200).send(imageDoc.image_data);
                  }
            );
      } catch (err) {
            console.error('Server error:', err);
            return res.status(500).json({ error: "Internal server error" });
      }
};


module.exports = {
      upload_image,
      get_image_by_id,
};
