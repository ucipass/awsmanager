
let albumBucketName = ''
let accessKeyId = ''
let secretAccessKey = ''
console.log("APP STARTED!" )
var AWS = require('aws-sdk');

let bucketRegion = 'us-east-1'

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.Credentials(accessKeyId, secretAccessKey)
});
var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: "aa-test12"}
});

s3.listBuckets( (err,data)=>{
  if (err){
    console.log("ERR",err)
  }
  else{
    console.log("DATA",data)
  }
})

