const workoutsService = require('../services/workoutsServices');

const getWorkoutsByUserId = async (req,res) => {
    try {
        const userId = req.user.userId;
        const workouts = await workoutsService.getWorkoutsByUserId(userId);
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getWorkout = async (req,res) => {
    try {
        const {workoutId} = req.params; 
        const userId = req.user.userId;
        const workouts = await workoutsService.getWorkout(userId,workoutId);
        res.status(200).json(workouts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const updateWorkout = async (req, res) => {
    try {
        const {workoutId} = req.params
        const userId = req.user.userId;;
        const updateData = req.body;
        const workout= await workoutsService.updateWorkout(userId, workoutId, updateData);
        console.log(workout)
        res.status(200).json({success:true, data:workout})
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createWorkout = async (req, res) => {
    console.log(req.body)
    try {
        const newWorkout = req.body;
        const userId = req.user.userId;
        const workout= await workoutsService.createWorkout(userId, newWorkout);
        return res.status(201).json(workout);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const deleteWorkout = async (req, res) => {
    console.log(req.params)
    try {
        const {workoutId} = req.params
        const userId = req.user.userId
        const workout= await workoutsService.deleteWorkout(userId, workoutId);
        return res.status(204).send();
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