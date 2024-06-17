const workoutsService = require('../services/workoutsServices');

const getWorkoutsByUserId = async (req,res) => {
    try {
        const { userId } = req.params; 
        const workouts = await workoutsService.getWorkoutsByUserId(userId);
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const updateWorkout = async (req, res) => {
    // Updates workout details, add/delete/update exercises
    try {
        const { userId } = req.params;
        const newWorkout = req.body;
        
        const workout = await workoutsService.updateWorkout(userId, newWorkout);
        res.json(workout);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createWorkout = async (req, res) => {
    console.log(req.body)
    try {
        const newWorkout = req.body;
        const {userId} = req.params
        const workout= await workoutsService.createWorkout(userId, newWorkout);
        res.status(201).json(workout);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const deleteWorkout = async (req, res) => {
    console.log(req.body)
    try {
        const {dateSelected, newMeasurements} = req.body;
        const {userId} = req.params
        const measurement= await workoutsService.deleteWorkoutByUser(userId, dateSelected, newMeasurements);
        res.status(201).json(measurement);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    getWorkoutsByUserId,
    createWorkout,
    updateWorkout,
    deleteWorkout
};