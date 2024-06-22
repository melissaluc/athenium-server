const workoutsService = require('../services/workoutsServices');

const getWorkoutsByUserId = async (req,res) => {
    try {
        const { userId} = req.params; 
        const workouts = await workoutsService.getWorkoutsByUserId(userId);
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getWorkout = async (req,res) => {
    try {
        const { userId, workoutId } = req.params; 
        const workouts = await workoutsService.getWorkout(userId,workoutId);
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const updateWorkout = async (req, res) => {
    try {
        const {userId, workoutId} = req.params;
        const updateData = req.body;
        const workout= await workoutsService.updateWorkout(userId, workoutId, updateData);
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
    try {
        const {userId, workoutId} = req.params
        const workout= await workoutsService.deleteWorkout(userId, workoutId);
        res.status(201).json(workout);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



module.exports = {
    getWorkoutsByUserId,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    getWorkout,
};