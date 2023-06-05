const Minio = require('minio');

const minio = new Minio.Client({
  useSSL: false,
  endPoint: process.env.APP_MINIO_ENDPOINT,
  port: parseInt(process.env.APP_MINIO_PORT),
  accessKey: process.env.APP_MINIO_ACCESS_KEY,
  secretKey: process.env.APP_MINIO_SECRET_KEY
});

const metaData = {
  'Content-Type': 'application/octet-stream'
};

const uploadFile = (bucket, objectName, file ) => {
  return new Promise((resolve, reject) => {
    minio.putObject(bucket, objectName, file, metaData, (err, etag) => {
      if (err) {
        reject(err);
      } else {
        resolve(etag);
      }
    });
  });
}

const getObject = (bucket, fileName) => new Promise((resolve, reject) => {
  minio.getObject(bucket, fileName, (err, stream) => {
    if (err) reject(err);

    let chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks || [])));
    stream.on('error', (err) => reject(err));
  });
});

const getFile = (bucket, fileName) => {
  return {
    createStream: () => {
      return new Promise((resolve, reject) => {
        return minio.getObject(
          bucket,
          fileName,
          '',
          (err, dataStream) => {
            if (err) {
              console.error(err);
              return reject(
                "Encountered Error while getting file"
              );
            }
            return resolve(dataStream);
          }
        );
      });
    },
    headers: async () => {
      const stat = await new Promise((resolve, reject) => {
        return minio.statObject(
          bucket,
          fileName,
          (err, stat) => {
            if (err) {
              reject(err);
            }
            return resolve(stat);
          }
        );
      });

      return {
        "Content-Type": stat.metaData["content-type"],
        "Content-Encoding": stat.metaData["content-encoding"],
        "Cache-Control": stat.metaData["cache-control"],
        "Content-Length": stat.size,
        "Record-ID": stat.metaData["record-id"]
      };
    }
  };
}

module.exports = {
  uploadFile,
  getFile
}
