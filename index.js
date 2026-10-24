// Log Navigation
function logger(req, res, next) {
    console.log(req.originalUrl)
    next()
}

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const helmet = require("helmet")
const passport = require('passport')
const session = require('express-session')
const bodyParser = require('body-parser');


const port = process.env.PORT || 8080; 
const host = process.env.HOST

const app = express();

app.use(logger);
app.use(cors({
    credentials: true,
    origin: [process.env.CLIENT_URL, 'http://localhost:3000']
}));
app.use(helmet())
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(express.static('public'));
app.use(bodyParser.json())

//  Google OAuth
// Express session
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
    }));

// Passport initialization
app.use(passport.session());
app.use(passport.authenticate("session"));
// app.use(passport.initialize());

// Routers
require("./routes/index.js")(app);


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
`

app.get('/api/v1', (req, res) => {
    res.send(serverHTML); 
});


// Log Host and Port
app.listen(port, ()=>console.log(`server running at host: ${host} port: ${port}`))


 