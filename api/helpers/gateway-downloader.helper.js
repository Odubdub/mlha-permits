  const fetch = require('node-fetch');
  const Downloader = require('nodejs-file-downloader')
  var minio = require('minio');
  const Application = require('../models/application/application.model');
  const { update } = require('lodash');
  
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
    const noValue = ['null', undefined, null]
  
    const attachmentKeys = Object.keys(application.applicationDetails).filter(key => key.endsWith('Att') && !noValue.includes(application.applicationDetails[key]))
  
    console.log('Att keys: ', attachmentKeys)
    const keysToResolve = attachmentKeys.filter(key => !application.applicationDetails[key].includes('.'))
  
    const attachmentReferences = []
  
    keysToResolve.forEach(key => {
      const newName = `${Date.now()}_${key}_${application.applicationDetails[key]}.pdf`
      
      attachmentReferences.push({id: application.applicationDetails[key], newName, key})
      //TODO: Add for files which may be in nested fields
      /*
      This is fine for now but once we have nested fields we need to add a loop here 
      Obviously check the type first...
      */
    })
  
    let resolveCount = 0
  
    for (let i = 0; i < attachmentReferences.length; i++) {
  
      const attRef = attachmentReferences[i]
  
      const url = `http://reg-ui-acc.gov.bw:8080/download?file=${attRef.id}&bucketname=mtcd001`;

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
            return attRef.newName
        }
      })
  
      try {
        
        const { filePath, downloadStatus } = await downloader.download()
  
        if (downloadStatus === 'COMPLETE') {
          
          await minioClient.fPutObject(application.department.toString(), attRef.newName, filePath, metaData)
          
          // console.log('File saved to Minio', filePath, attRef.newName, application.department.toString());
          await Application.findByIdAndUpdate(application._id, {[`applicationDetails.${attRef.key}`]: attRef.newName });
  
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