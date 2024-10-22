import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// AWS S3 configuration
const s3 = new S3Client({
  region: process.env.AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

// MongoDB connection string
const mongoURI = 'mongodb+srv://iquest:MT43PfScUvC1uhAD@iquest.rqqbert.mongodb.net/';

// Backup function
const backupMongoDB = async () => {
  const backupFileName = `backup-${new Date().toISOString()}.gz`;
  const backupFilePath = path.join(__dirname, backupFileName);

  // Using mongodump to create a backup
  exec(`mongodump --uri="${mongoURI}" --archive=${backupFilePath} --gzip`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during mongodump: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    // Read the backup file
    fs.readFile(backupFilePath, (err, data) => {
      if (err) {
        console.error(`Error reading backup file: ${err.message}`);
        return;
      }

      // Upload the backup file to S3
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_DB_BACKUP,
        Key: backupFileName,
        Body: data,
        ContentType: 'application/gzip'
      };

      const uploadCommand = new PutObjectCommand(params);
      s3.send(uploadCommand)
        .then(async (data) => {
          // Clean up the local backup file
          fs.unlink(backupFilePath, (err) => {
            if (err) {
              console.error(`Error deleting local backup file: ${err.message}`);
              return;
            }

            console.log(`Local backup file deleted successfully: ${backupFilePath}`);
          });

          // Delete old backups
          await deleteOldBackups();
        })
        .catch((err) => {
          console.error(`Error uploading to S3: ${err.message}`);
        });
    });
  });
};

// Function to delete old backups
const deleteOldBackups = async () => {
  const listParams = {
    Bucket: process.env.AWS_S3_BUCKET_DB_BACKUP,
  };

  try {
    const listCommand = new ListObjectsV2Command(listParams);
    const { Contents } = await s3.send(listCommand);
    const backups = Contents.filter((item) => item.Key.startsWith('backup-'));
    
    // Sort by last modified date and keep only the latest one
    backups.sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified));
    const oldBackups = backups.slice(1); // Keep the most recent one

    for (const backup of oldBackups) {
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_DB_BACKUP,
        Key: backup.Key,
      };

      await s3.send(new DeleteObjectCommand(deleteParams));
      console.log(`Old backup deleted: ${backup.Key}`);
    }
  } catch (error) {
    console.error(`Error deleting old backups: ${error.message}`);
  }
};

const listBackups = async () => {
  const listParams = {
    Bucket: process.env.AWS_S3_BUCKET_DB_BACKUP,
  };

  try {
    const listCommand = new ListObjectsV2Command(listParams);
    const { Contents } = await s3.send(listCommand);

    if (!Contents || Contents.length === 0) {
      console.log('No backups found in S3 bucket.');
      return [];
    }

    // Log available backups
    Contents.forEach((item) => {
      console.log(`Available backup: ${item.Key}`);
    });

    return Contents;
  } catch (error) {
    console.error(`Error listing backups: ${error.message}`);
  }
};

// Function to fetch, unzip, and restore a backup
const restoreBackup = async () => {
  const backups = await listBackups();
  if (backups.length === 0) return;

  // Fetch the most recent backup file
  const latestBackup = backups
    .filter((item) => item.Key.startsWith('backup-'))
    .sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified))[0];

  if (!latestBackup) {
    console.log('No valid backups found to restore.');
    return;
  }

  const backupFileName = latestBackup.Key;
  const backupFilePath = path.join(__dirname, backupFileName);

  // Download the latest backup file from S3
  const downloadParams = {
    Bucket: process.env.AWS_S3_BUCKET_DB_BACKUP,
    Key: backupFileName,
  };

  try {
    const { Body } = await s3.send(new GetObjectCommand(downloadParams));
    const fileStream = fs.createWriteStream(backupFilePath);
    Body.pipe(fileStream);

    fileStream.on('finish', () => {
      console.log(`Backup file downloaded successfully: ${backupFilePath}`);
      
      // Restore the backup
      exec(`mongorestore --uri="${mongoURI}" --archive=${backupFilePath} --gzip`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error during mongorestore: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }

        console.log(`Backup restored successfully from: ${backupFilePath}`);
        
        // Clean up the downloaded file
        fs.unlink(backupFilePath, (err) => {
          if (err) {
            console.error(`Error deleting downloaded backup file: ${err.message}`);
            return;
          }
          
          console.log(`Downloaded backup file deleted successfully: ${backupFilePath}`);
        });
      });
    });
  } catch (error) {
    console.error(`Error downloading backup from S3: ${error.message}`);
  }
};

// Schedule the backup function to run at midnight on the first day of each month
cron.schedule('0 0 1 * *', backupMongoDB); // Every 1st day of the month at midnight
// cron.schedule('* * * * * *', backupMongoDB);
// backupMongoDB();
// restoreBackup();

export { backupMongoDB, restoreBackup };
