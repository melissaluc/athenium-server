

module.exports = function(app) {

    const authRouter = require("./auth.js")
    app.use("/api/v1/auth", authRouter);
    
    const verifyEmailRouter = require("./verifyEmail.js");
    app.use("/api/v1/verify-email", verifyEmailRouter);
    
    const resetPassword = require("./resetPassword.js");
    app.use("/api/v1/reset-password", resetPassword);
    
    const usersRouter = require('./users.js');
    app.use('/api/v1/user', usersRouter);
    
    const dashboardRouter = require('./dashboard.js');
    app.use('/api/v1/dashboard', dashboardRouter);
    
    const bodyCompositionRouter = require('./bodyComposition.js');
    app.use('/api/v1/body-composition', bodyCompositionRouter);
    
    const exercisesRouter = require('./trends.js');
    app.use('/api/v1/trends', exercisesRouter);
    
    const workoutsRouter = require('./workouts.js');
    app.use('/api/v1/workouts', workoutsRouter);
    
    const goalsRouter = require('./goals.js');
    app.use('/api/v1/goals', goalsRouter);
    
    const mealsRouter = require('./meals.js');
    app.use('/api/v1/nutrition', mealsRouter);
    
    const measurementsRouter = require('./measurements.js');
    app.use('/api/v1/measurements', measurementsRouter);
    
    const strengthRouter = require('./strength.js');
    app.use('/api/v1/strength', strengthRouter);
}