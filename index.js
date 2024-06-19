// Log Navigation
function logger(req, res, next) {
    console.log(req.originalUrl)
    next()
}


const express = require('express');
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT || 8080; 
const host = process.env.DB_HOST

const app = express();
app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(express.static('public'));






//  Routes
// Logs: Workouts, nutrition/meal planner, goals, measurements
// Schedule: schedule (planned workout and meals)
// User: validate user log in
// Dashboard: user profile data, user stats 
// Measurements: weight, circumference, bodyfat, muscle mass
// Tracking: measurements, meals, workout, goalsls
// Strength Level: calculate strength level
// Exercises: exercises

// http://localhost:5000/api/v1/measurements/39b17fed-61d6-492a-b528-4507290d5423

// const usersRouter = require('./routes/users.js');
// app.use('/api/v1/users', usersRouter);

// const dashboardRouter = require('./routes/dashboard.js');
// app.use('/api/v1/dashboard', dashboardRouter);

// const exercisesRouter = require('./routes/exercises.js');
// app.use('/api/v1/exercises', exercisesRouter);

// const scheduleRouter = require('./routes/schedule.js');
// app.use('/api/v1/schedule', scheduleRouter);

// const trackerRouter = require('./routes/tracker.js');
// app.use('/api/v1/tracker', trackerRouter);

const workoutsRouter = require('./routes/workouts.js');
app.use('/api/v1/workouts', workoutsRouter);

// const goalsRouter = require('./routes/goalsLog.js');
// app.use('/api/v1/goals', goalsRouter);

const mealsRouter = require('./routes/meals.js');
app.use('/api/v1/nutrition', mealsRouter);

const measurementsRouter = require('./routes/measurements.js');
app.use('/api/v1/measurements', measurementsRouter);

// const strengthRouter = require('./routes/strength.js');
// app.use('/api/v1/strength', strengthRouter);


// Define route handler for the root URL
app.get('/', (req, res) => {
    res.send('Athenium Server'); // You can customize this response
});




// Log Host and Port
app.listen(port, ()=>console.log(`server running at Host:localhost port: ${port}`))


