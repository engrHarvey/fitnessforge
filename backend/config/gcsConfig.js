const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Initialize Google Cloud Storage with the service account key
const storage = new Storage({
  keyFilename: path.join(__dirname, '../credentials/fitnessforge.json'),  // Path to your JSON key file
  projectId: 'fitnessforge-437417',  // Replace with your Google Cloud project ID
});

// Specify the bucket name
const bucketName = 'fitnessforge-image';  // Replace with your bucket name
const bucket = storage.bucket(bucketName);

module.exports = bucket;
