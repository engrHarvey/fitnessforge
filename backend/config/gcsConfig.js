const { Storage } = require('@google-cloud/storage');
require('dotenv').config();

// Initialize Google Cloud Storage with the credentials from environment variables
const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: {
    type: process.env.GCS_TYPE,
    private_key_id: process.env.GCS_PRIVATE_KEY_ID,
    private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Ensure newlines are correctly formatted
    client_email: process.env.GCS_CLIENT_EMAIL,
    client_id: process.env.GCS_CLIENT_ID,
    auth_uri: process.env.GCS_AUTH_URI,
    token_uri: process.env.GCS_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GCS_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.GCS_CLIENT_CERT_URL,
  },
});

// Specify the bucket name
const bucketName = 'fitnessforge-image'; // Replace with your bucket name
const bucket = storage.bucket(bucketName);

module.exports = bucket;
