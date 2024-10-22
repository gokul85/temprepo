// import AWS from "aws-sdk";

// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
// });

// export const uploadImageToAws = async (keyValue, blob) => {
//     const uploadedImage = await s3.upload({
//         Bucket: process.env.AWS_S3_BUCKET_NAME,
//         Key: keyValue,
//         Body: blob,
//       }).promise()
//       if(uploadedImage){
//         return uploadedImage.Location;
//       }
// }

// export const uploadTxttoaws = async (keyValue, blob) => {
//   const uploadedImage = await s3.putObject({
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Key: "index.txt",
//       Body: "Hello santhosh",
//     }).promise()
//     if(uploadedImage){
//       return uploadedImage.Location;
//     }
// }
// import AWS from "aws-sdk";
// import fs from "fs";

// // Configure AWS SDK with your credentials
// AWS.config.update({
//   accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
//   region: 'ap-south-1'
// });

// const s3 = new AWS.S3();

// // Route to handle image upload
// const uploadFileToAWS = async (files) => {
//   try {
//     const uploadedImages = [];

//     for (const file of files) {
//       const fileStream = fs.createReadStream(file.path);
//       const params = {
//         Bucket: process.env.AWS_S3_BUCKET_NAME,
//         Key: file.filename,
//         Body: fileStream
//       };

//       const uploadResult = await s3.upload(params).promise();
//       uploadedImages.push(uploadResult.Location);

//       // Delete the temporary file after upload
//       fs.unlinkSync(file.path);
//     }

//     return {status : true , imageLink : uploadedImages};
//   } catch (error) {
//     console.error("Error uploading images:", error);
//     return false;
//   }
// }

// export default uploadFileToAWS;

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const accessKey = process.env.AWS_S3_ACCESS_KEY_ID;
const secretKey = process.env.AWS_S3_SECRET_ACCESS_KEY;
const region = process.env.AWS_S3_BUCKET_REGION;
const bucketName = process.env.AWS_S3_BUCKET_NAME;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  region: region,
});

const generateCryptoFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

export const uploadFileToAWS = async (files) => {
  try {
    var fileName = [];
    for (const file of files) {
      //   const fileStream = fs.createReadStream(file.path);

      const cryptoFileName = generateCryptoFileName();

      const params = {
        Bucket: bucketName,
        Key: cryptoFileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      let command = new PutObjectCommand(params);
      await s3.send(command);
      fileName.push(cryptoFileName);
    }

    return fileName;
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const getSignedURL = async (fileName) => {
  try {
    const getObjectParams = {
      Bucket: bucketName,
      Key: fileName,
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return url;
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const deleteAWSFile = async (fileName) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: fileName,
    };
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
