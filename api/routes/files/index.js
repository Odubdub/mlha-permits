var minio = require('minio')
var express = require('express')
var multer = require('multer');
const { getFile } = require('../../util/minio.util');

var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');

const router = express.Router()

const minioClient = new minio.Client({
  useSSL: false,
  endPoint: process.env.APP_MINIO_ENDPOINT,
  port: parseInt(process.env.APP_MINIO_PORT),
  accessKey: process.env.APP_MINIO_ACCESS_KEY,
  secretKey: process.env.APP_MINIO_SECRET_KEY
});
  
const metaData = {
  'Content-Type': 'application/octet-stream'
};

const fileStorageEngine = multer.diskStorage({

  destination: (req, file, cb) => {
      cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
      console.log(file);
      const fileName = `${Date.now()}-${file.originalname}`;
      if (req.newFileNames){
        req.newFileNames[file.fieldname] = fileName;
      } else {
        req.newFileNames = {[file.fieldname]: fileName};
      }
      cb(null, fileName);
  },
})

const upload = multer({ storage: fileStorageEngine})
const uploadAll = (bucket, req, res) => {
  req.files.forEach(file => {
    console.log(file.path);
    minioClient.fPutObject(bucket, file.filename, file.path, metaData)
  });

  res.json(req.newFileNames);
}

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.post('/upload', upload.any(), (req, res, next) => {

  console.log(req.body)
  const bucket = req.body.destination
  uploadAll(bucket, req, res)
});

router.get("/preview/:bucket/:filename", (req, res)=> {
  minioClient.getObject(req.params.bucket, req.params.filename, (error, stream)=> {
      if(error) {
          return res.status(500).send(error);
      }
      stream.pipe(res);
  });
});

router.route("/download/:bucket/:filename")
.get(async (req, res, next) => {
  const fileStream = await getFile(req.params.bucket, req.params.filename).createStream();
  res.set('Content-disposition', 'attachment; filename=' + req.params.filename);
  res.setHeader('Content-Type', 'application/pdf');
  fileStream.pipe(res);
});

//endpoint that gets file from multipart form and uploads it to minio
router.post('/upload/:serviceCode', upload.single('file'), (res, req, next) => {

  console.log(req.body)

  //get the uploaded file from the multer middleware
  const file = req.file
  console.log(file)
  //get file from local storage and post with multipart form
  const bucket = req.params.serviceCode

  var data = new FormData();
  data.append('file', fs.createReadStream('/Users/owashe/Downloads/office-work-gbdb8a3e4e_1920.jpg'));
  data.append('type', req.file.mimetype.split('/')[1]);
  data.append('name', req.file.originalname);
  data.append('description', 'life is good');

  var config = {
    method: 'post',
    url: 'http://reg-ui-acc.gov.bw:8080/upload/MTCD001',
    headers: { 
      ...data.getHeaders()
    },
    data : data
  };

  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
})

module.exports = router;