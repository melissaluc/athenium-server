// models/measurementModel.js
const measurementService = require('../services/measurementServices');

const getMeasurementsByUserId = async (req,res) => {
    try {
        const userId = req.user.userId;
        const measurements = await measurementService.getByUserId(userId);
        res.json(measurements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const updateMeasurement = async (req, res) => {
    try {
        const userId = req.user.userId;
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
        const userId = req.user.userId;
        const measurement= await measurementService.createMeasurementByUser(userId, dateSelected, newMeasurements);
        res.status(201).json(measurement);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getMeasurementsByUserId,
    createMeasurement,
    updateMeasurement
};