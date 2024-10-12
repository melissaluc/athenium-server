const AWS = require('aws-sdk');
const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();


// Initialize the S3 client
const s3 = new AWS.S3();

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
            envContent.split('\n').forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) {
                    process.env[key.trim()] = value.trim();
                }
            });

            console.log('Environment variables loaded from S3');
            resolve();
        });
    });
};

// Load environment variables from S3 before setting up other middleware
loadEnvFromS3().then(() => {
    // Middleware
    const app = express();
    app.use(logger);
    app.use(cors({
        credentials: true,
        origin: process.env.CLIENT_URL
    }));
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.use(bodyParser.json());
    const port = 1000; 
    // const port = process.env.PORT || 8080; 
    const host = process.env.HOST;


    app.use(
        session({
            resave: false,
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET,
            cookie: {
                secure: process.env.NODE_ENV === "production" ? "true" : "auto",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            },
        })
    );

    // Passport initialization
    app.use(passport.session());
    app.use(passport.authenticate("session"));

    // Routers
    const authRouter = require("./routes/auth.js");
    app.use("/api/v1/auth", authRouter);
    const verifyEmailRouter = require("./routes/verifyEmail.js");
    app.use("/api/v1/verify-email", verifyEmailRouter);
    const resetPassword = require("./routes/resetPassword.js");
    app.use("/api/v1/reset-password", resetPassword);
    const usersRouter = require('./routes/users.js');
    app.use('/api/v1/user', usersRouter);
    const dashboardRouter = require('./routes/dashboard.js');
    app.use('/api/v1/dashboard', dashboardRouter);
    const bodyCompositionRouter = require('./routes/bodyComposition.js');
    app.use('/api/v1/body-composition', bodyCompositionRouter);
    const exercisesRouter = require('./routes/trends.js');
    app.use('/api/v1/trends', exercisesRouter);
    const workoutsRouter = require('./routes/workouts.js');
    app.use('/api/v1/workouts', workoutsRouter);
    const goalsRouter = require('./routes/goals.js');
    app.use('/api/v1/goals', goalsRouter);
    const mealsRouter = require('./routes/meals.js');
    app.use('/api/v1/nutrition', mealsRouter);
    const measurementsRouter = require('./routes/measurements.js');
    app.use('/api/v1/measurements', measurementsRouter);
    const strengthRouter = require('./routes/strength.js');
    app.use('/api/v1/strength', strengthRouter);

    // Define route handler for the root URL
    const serverHTML = `
    <html>
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <h1 style="font-family: 'Silkscreen', sans-serif;" >Athenium</h1>
    </html>
    `;

    app.get('/', (req, res) => {
        res.send(serverHTML); 
    });

    // Log Host and Port
    app.listen(port, () => console.log(`server running at host: ${host} port: ${port}`));
}).catch(error => {
    console.error('Failed to load environment variables:', error);
});

// Log Navigation
function logger(req, res, next) {
    console.log(req.originalUrl);
    next();
}

