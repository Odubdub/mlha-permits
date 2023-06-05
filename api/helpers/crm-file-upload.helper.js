var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
const { Readable } = require('stream');
const { v4: uuid_v4 } = require('uuid');

const { getFile } = require('../util/minio.util');

const uploadToCRM = async (certificateFile, serviceCode,onComplete, onError) => {

    const { name, etag, bucket, versionId } = certificateFile;

    const fileStream = await getFile(bucket, name).createStream();

    const uid = uuid_v4();

    var data = new FormData();
    data.append('file', fileStream);
    data.append('type', 'certificate');
    data.append('name', name);
    data.append('description', 'a printout of a permit/license/certificate/registration');

    var config = {
        method: 'post',
        url: `http://reg-ui-acc.gov.bw:8080/upload/${serviceCode}`,
        headers: { 
          ...data.getHeaders()
        },
        data : data
      };
    
    axios(config)
    .then(function (response) {
        onComplete(response.data);
    })
    .catch(function (error) {
        console.log(error);
        onError(error);
    });
    //return result.data;
}

const uploadToCentralBucket = async ({ buffer, serviceCode, fileName, type}, onComplete, onError) => {

    var data = new FormData();
    
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);

    data.append('file', bufferStream, {
    filename: fileName,
    contentType: 'application/octet-stream'
    });
    data.append('type', type);
    data.append('name', fileName);
    data.append('description', `a printout of the ${type}`);

    var config = {
        method: 'post',
        url: `http://reg-ui-acc.gov.bw:8080/upload/${serviceCode}`,
        headers: { 
            'Content-Type': 'multipart/form-data'
        },
        data : data
      };
    
      return new Promise((resolve, reject) => {
        axios(config)
        .then((response) => {
            resolve(response.data);
        })
        .catch((error) => {
            console.log(error);
            reject(error);
        });
      });
}

module.exports = {uploadToCRM, uploadToCentralBucket};