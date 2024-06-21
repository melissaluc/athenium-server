// models/measurementModel.js
const scheduleService = require('../services/scheduleServices');

const getByUserId = async (req,res) => {
    console.log('service',req.params)
    try {
        const { userId } = req.params; 
        const schedule = await scheduleService.getByUserId(userId);
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const updateMeasurement = async (req, res) => {
    try {
        const { userId } = req.params;
        const { dateSelected, newMeasurements } = req.body;
        // Convert UNIX timestamp to ISO 8601 format
        // const dateSelectedConverted = new Date(dateSelected * 1000).toISOString();
        
        const measurements = await measurementService.updateByUserId(userId, dateSelected, newMeasurements);
        res.json(measurements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const createMeasurement = async (req, res) => {
    console.log(req.body)
    try {
        const {dateSelected, newMeasurements} = req.body;
        const {userId} = req.params
        const measurement= await measurementService.createMeasurementByUser(userId, dateSelected, newMeasurements);
        res.status(201).json(measurement);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getByUserId,
    createMeasurement,
    updateMeasurement
};