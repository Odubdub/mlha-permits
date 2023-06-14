const multer = require('multer');
const express = require('express');
const FormData = require('form-data');
const { getFile, uploadFile } = require('../../util/minio.util');
const File = require('../../models/files/file.model');

const router = express.Router();

// Set up multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    const bucketName = 'mlha-permits';
    const fileName = generateUniqueId(file.originalname);

    const fileBuffer = file.buffer; // get the Buffer of the file

    console.log("file name: " + fileName);

    const etag = await uploadFile(bucketName, fileName, fileBuffer);

    console.log("etag: " + JSON.stringify(etag));

    const fileDocument = new File({
      key: etag.etag,
      name: fileName,
      bucket: bucketName,
      versionId: etag.versionId,
      extension: fileName.split('.').pop()
    });

    await fileDocument.save();

    console.log(fileDocument);

    res.status(200).json({
      fileDocument
      // id: 7
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Encountered Error while uploading file',
    });
  }
});

router.get('/download/:bucket/:filename', async (req, res) => {
  try {
    const { bucket, filename } = req.params;

    const fileStream = await getFile(bucket, filename).createStream();

    res.set('Content-disposition', 'attachment; filename=' + filename);
    // res.setHeader('Content-Type', 'application/pdf');
    fileStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Encountered Error while downloading file',
    });
  }
});

function generateUniqueId(originalname) {
  // Get the file extension
  const extension = originalname.split('.').pop();
  
  // Generate a unique ID
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);

  // Return the unique ID with the original file extension
  return `${timestamp}${randomPart}.${extension}`;
}

module.exports = router;