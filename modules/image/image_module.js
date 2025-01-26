const sharp = require("sharp");
const { ObjectId } = require("mongodb");
const { image_collection } = require("../../collection/collections/image_collection");
const { response_sender } = require("../../modules/hooks/respose_sender");
const { PDFDocument } = require('pdf-lib');

const upload_image = async (req, res, next) => {

      try {
            const imageBuffer = req.file.buffer;
            const mimeType = req.file.mimetype; //
            const image_title = req.body?.title;

            // Initialize sharp with the image buffer
            let sharpInstance = sharp(imageBuffer).resize({ width: 800 }); // Resize to 800px width, maintaining aspect ratio

            // Compress the image based on the MIME type
            let compressedImageBuffer;
            if (mimeType === 'application/pdf') {
                  compressedImageBuffer = imageBuffer;
            }
            else if (mimeType === "image/svg+xml") {
                  compressedImageBuffer = imageBuffer;
            }
            else if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
                  compressedImageBuffer = await sharpInstance
                        .jpeg({ quality: 90 })
                        .toBuffer();
            } else if (mimeType === "image/png") {
                  compressedImageBuffer = await sharpInstance
                        .png({ compressionLevel: 8 })
                        .toBuffer();
            }
            else if (mimeType === "image/webp") {
                  compressedImageBuffer = await sharpInstance
                        .webp({ quality: 90 })
                        .toBuffer();
            }
            else if (mimeType === "image/gif") {
                  compressedImageBuffer = await sharpInstance
                        .gif()
                        .toBuffer();
            }

            else if (mimeType === "image/bmp") {
                  compressedImageBuffer = await sharpInstance
                        .bmp()
                        .toBuffer();
            }
            else {
                  return res.status(400).json({ error: "Unsupported image format" });
            }

            // Create data object
            let data = {
                  image: compressedImageBuffer,
                  fileType: mimeType,
                  createdAt: new Date(),
            };



            if (image_title) {
                  data.title = image_title;
            }
            const result = await image_collection.insertOne(data);
            const imageUrl = `https://image.kalbelajobs.com/api/v1/image/${result.insertedId}`;
            const fileExtension = mimeType.split("/")[1];
            const file_url = `${imageUrl}.${fileExtension}`

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Image uploaded successfully",
                  data: {
                        image_url: file_url
                  },
            })
      } catch (err) {
            next(err);
      }
};






const get_image_by_id = async (req, res, next) => {
      try {
            let imageId = req.params.id;
            imageId = imageId.replace(/\.[^/.]+$/, "");

            const imageDoc = await image_collection.findOne({
                  _id: new ObjectId(imageId),
            });

            if (!imageDoc) {
                  return res.status(404).json({ error: "Image not found" });
            }

            if (imageDoc.fileType === 'application/pdf') {
                  // For PDF files, send directly without processing
                  res.contentType('application/pdf');
                  res.setHeader('Content-Disposition', 'inline; filename="document.pdf"');
                  const pdfBuffer = Buffer.from(imageDoc.image.buffer, 'base64');
                  return res.send(pdfBuffer);
            } else {
                  // For other file types (image formats), handle as before
                  res.contentType(imageDoc.fileType || 'image/jpeg');
                  const imageBuffer = Buffer.from(imageDoc.image.buffer, 'base64');
                  return res.status(200).send(imageBuffer);
            }

      } catch (err) {
            console.error('Server error:', err);
            return res.status(500).json({ error: "Internal server error" });
      }
};



module.exports = {
      upload_image,
      get_image_by_id,
};
