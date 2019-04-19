var AWS = require('aws-sdk');

const AWS_PUBLIC = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

if (!AWS_PUBLIC || !AWS_SECRET_KEY) {
  throw new Error("Failed to deploying");
}

const s3 = new AWS.S3({
  accessKeyId: AWS_PUBLIC,
  secretAccessKey: AWS_SECRET_KEY,
  region: "us-east-2"
});

const s3_params = {
  Bucket: "fpa-production-deploy",
  Key: "fpa-backend.zip",
  ACL: "public-read",
  Body: fs.createReadStream("deploy/fpa-backend.zip"),
  ContentType: "application/zip"
};


s3.upload(s3_params, (err, data) => {
  console.log(err);
  console.log(data);
});
