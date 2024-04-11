// require('./strengthCalculator.js');

const express = require('express');
const cors = require('cors');

require('dotenv').config();


const port = process.env.PORT || 8080; 
const host = process.env.DB_HOST



const app = express();
app.use(cors());
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(express.static('public'));

//  Routes
// Users
const productInventoryRouter = require('./routes/users.js');
app.use('/api/v1/users', productInventoryRouter);

// Logs
const productInventoryRouter = require('./routes/logs.js');
app.use('/api/v1/logs', productInventoryRouter);

// Strength Calculator
const productInventoryRouter = require('./routes/logs.js');
app.use('/api/v1/logs', productInventoryRouter);


// Log Host and Port
app.listen(port, ()=>console.log(`server running at Host:${host} port: ${port}`))

// Log Navigation
function logger(req, res, next) {
    console.log(req.originalUrl)
    next()
}


 get users data 
 get