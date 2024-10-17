const AWS = require('aws-sdk');

// Initialize the S3 client
const s3 = new AWS.S3();

const s3EnvVars = {};


// function to convert stream to string resolving ReferenceError: ReadableStream is not defined
const streamToString = (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });
};


// use .env from S3 bucket
const loadEnvFromS3 = async () => {
    try {
        const data = await s3.send(new GetObjectCommand({ Bucket: 'athenium-server-code-bucket', Key: '.env' }));
        const envContent = (await streamToString(data.Body)).toString('utf-8');
        
        envContent.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                s3EnvVars[key.trim()] = value.trim();
            }
        });
        console.log('Environment variables loaded from S3');
    } catch (error) {
        console.error('Error loading .env from S3:', error);
        throw error;
    }
};

module.exports = {
    loadEnvFromS3,
    s3EnvVars
};

