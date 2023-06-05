const fetch = require('node-fetch');
const Downloader = require('nodejs-file-downloader')
var minio = require('minio');
const Application = require('../models/application/application.model');
const { update } = require('lodash');
const { isObject } = require('./util');

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

const downloadFileFromCRM = async (fileId) => {
  const headers = {
    'X-Appwrite-Project': process.env.CRM_APPWRITE_PROJECT,
    'X-Appwrite-key': process.env.CRM_APPWRITE_KEY
  };

  const url = `${process.env.CRM_DOWNLOAD_BUCKET_URL}${fileId}/download`;

  const response = await fetch(url, {
    method: 'GET',
    headers
  });

  const buffer = await response.buffer();
  return buffer;
}

const resolveCRMFiles = async (application, onComplete=()=>{}) => {

  // Find a list of keys with suffix 'Att' in data

  const attachmentKeys = Object.keys(application.applicationDetails).filter(key => key.endsWith('Att'))

  console.log('Att keys: ', attachmentKeys)
  const keysToResolve = attachmentKeys.filter(key => isObject(application.applicationDetails[key]))

  let resolveCount = 0

  for (let i = 0; i < keysToResolve.length; i++) {

    const key = keysToResolve[i]
    const attachment = application.applicationDetails[key]
    const newName = `${attachment.key}.${attachment.extension}`;

    const url = `http://reg-ui-acc.gov.bw:8080/download/${attachment.bucket}/${attachment.key}`
    console.log(url)

    const downloader = new Downloader({
      headers: {
          'X-Appwrite-Project': process.env.CRM_APPWRITE_PROJECT, 
          'X-Appwrite-key':  process.env.CRM_APPWRITE_KEY
      },
      url: url,
      directory: `./uploads`,
      maxAttempts: 3,
      onBeforeSave: (_) => {
          return newName
      }
    })

    try {
      
      const { filePath, downloadStatus } = await downloader.download()

      if (downloadStatus === 'COMPLETE') {
        
        minioClient.fPutObject(application.department.toString(), newName, filePath, metaData)
        
        // console.log('File saved to Minio', filePath, attRef.newName, application.department.toString());
        await Application.findByIdAndUpdate(application._id, {[`applicationDetails.${key}`]: newName });

      } else {
        console.log('Error downloading file');
      }
    } catch (error) {
      console.log(error)
    } finally {
      resolveCount++
      if (keysToResolve.length == resolveCount){
        onComplete(application)
      }
    }
  }
}

module.exports = { downloadFileFromCRM, resolveCRMFiles, minioClient };


const downloadFileAppwrite = async (fileId) => {
  const headers = {
    'X-Appwrite-Project': process.env.CRM_APPWRITE_PROJECT,
    'X-Appwrite-key': process.env.CRM_APPWRITE_KEY
  };

  const url = `${process.env.CRM_DOWNLOAD_BUCKET_URL}${fileId}/download`;

  const response = await fetch(url, {
    method: 'GET',
    headers
  });

  const buffer = await response.buffer();
  return buffer;
}


//get buffer and upload to reg-ui as multipart/form-data
// const uploadFile = async (fileBuffer, fileName, department) => {
//   const headers = {
//     'X-Appwrite-Project': process.env.CRM_APPWRITE_PROJECT,
//     'X-Appwrite-key': process.env.CRM_APPWRITE_KEY
//   };

//   const url = `${process.env.CRM_UPLOAD_BUCKET_URL}files`;

//   const response = await fetch(url, {
//     method: 'POST',
//     headers,
//     body: fileBuffer
//   });

//   const json = await response.json();
//   return json;
// }