const workoutsService = require('../services/workoutsServices');

const getWorkoutsByUserId = async (req,res) => {
    try {
        const { userId } = req.params; 
        const measurements = await workoutsService.getByUserId(userId);
        res.json(measurements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const updateWorkout = async (req, res) => {
    try {
        const { userId } = req.params;
        const { dateSelected, newMeasurements } = req.body;
        // Convert UNIX timestamp to ISO 8601 format
        // const dateSelectedConverted = new Date(dateSelected * 1000).toISOString();
        
        const measurements = await workoutsService.updateByUserId(userId, dateSelected, newMeasurements);
        res.json(measurements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const createWorkout = async (req, res) => {
    console.log(req.body)
    try {
        const {dateSelected, newMeasurements} = req.body;
        const {userId} = req.params
        const measurement= await workoutsService.createMeasurementByUser(userId, dateSelected, newMeasurements);
        res.status(201).json(measurement);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteWorkout = async (req, res) => {
    console.log(req.body)
    try {
        const {dateSelected, newMeasurements} = req.body;
        const {userId} = req.params
        const measurement= await workoutsService.createMeasurementByUser(userId, dateSelected, newMeasurements);
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