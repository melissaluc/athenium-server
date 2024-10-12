const AWS = require('aws-sdk');

// Initialize the S3 client
const s3 = new AWS.S3();

const s3EnvVars = {};

// use .env from S3 bucket
const loadEnvFromS3 = () => {
    return new Promise((resolve, reject) => {
        s3.getObject({ Bucket: 'athenium-server-code-bucket', Key: '.env' }, (error, data) => {
            if (error) {
                console.error('Error loading .env from S3:', error);
                reject(error);
                return;
            }

            const envContent = data.Body.toString('utf-8');
            // const loadedVars = {};
            envContent.split('\n').forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) {
                    s3EnvVars[key.trim()] = value.trim();
                    // loadedVars[key.trim()] = value.trim(); 
                }
            });

            // console.log('Environment variables loaded from S3: ',loadedVars);
            console.log('Environment variables loaded from S3');
            resolve();
        });
    });
};

module.exports = {
    loadEnvFromS3,
    s3EnvVars
};

