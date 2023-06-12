const router = require('express').Router();

const multer = require('multer');
const Minio = require('minio');
const { MongoClient } = require('mongodb');
const { Readable } = require('stream');
const FileModel = require('../model/file');

// MinIO configuration
const minioClient = new Minio.Client({
  endPoint: '127.0.0.1',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin'
});

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MongoDB configuration
const mongoClient = new MongoClient('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let db;

// Connect to MongoDB
mongoClient.connect((err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  db = mongoClient.db('filedb');
});

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

function removeSpecialCharacters(str) {
  // Remove spaces and special characters using regular expressions
  const cleanedStr = str.replace(/[^a-zA-Z0-9]/g, '');

  return cleanedStr.toLowerCase();
}

function generateUniqueId() {
  const timestamp = Date.now().toString(36); // Convert current timestamp to base36 string
  const randomNum = Math.random().toString(36).substr(2, 5); // Generate random number and convert to base36 string

  return timestamp + randomNum;
}

// Download endpoint
router.get('/download/:bucket/:id', (req, res) => {
  const bucketName = removeSpecialCharacters(req.params.bucket);
  const id = req.params.id;

  FileModel.findOne({ id: id }).exec(async (err, fileDocument) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to retrieve file document.');
    }

    if (!fileDocument) {
      return res.status(404).send('File document not found.');
    }

    const objectName = fileDocument.key;

    minioClient.getObject(bucketName, objectName, (err, dataStream) => {
      if (err) {
        console.error(err);
        return res.status(404).send('File not found.');
      }

      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileDocument['original-name']}"`
      );

      dataStream.pipe(res);
    });
  });
});

// Upload endpoint
router.post('/upload/:bucket', upload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const metaData = {
    'Content-Type': file.mimetype
  };

  const fileStream = bufferToStream(file.buffer);
  const bucketName = removeSpecialCharacters(req.params.bucket);
  const extension = file.originalname.split('.').pop();
  const originalName = file.originalname;
  const key = generateUniqueId();

  // Check if the bucket exists, and create it if it doesn't
  minioClient.bucketExists(bucketName, (err, exists) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to check bucket existence.');
    }

    if (!exists) {
      minioClient.makeBucket(bucketName, 'us-east-1', (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Failed to create bucket.');
        }

        uploadFile();
      });
    } else {
      uploadFile();
    }
  });

  // Function to upload the file to MinIO and create the file document in MongoDB
  function uploadFile() {
    minioClient.putObject(bucketName, key, fileStream, metaData, (err, etag) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Failed to upload file.');
      }

      const fileDocument = {
        bucket: bucketName,
        extension,
        'original-name': originalName,
        key
      };

      FileModel.create(fileDocument)
        .then((result) => {
          res.json(fileDocument);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).send(err);
        });
    });
  }
});

module.exports = router;
