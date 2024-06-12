// models/measurementModel.js
const measurementService = require('../services/measurementServices');

const getMeasurementsByUserId = async (req,res) => {
    try {
        const { userId } = req.params; 
        const measurements = await measurementService.getByUserId(userId);
        res.json(measurements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const updateMeasurement = async (req, res) => {
    try {
        const { userId } = req.params;
        const {dateSelected, newMeasurements} = req.body
        const dateSelectedConverted = new Date(dateSelected*1000).toISOString()
        const measurements = await measurementService.updateByUserId(userId, dateSelectedConverted , newMeasurements);
        res.json(measurements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createMeasurement = async (req, res) => {
    try {
        const measurement = req.body;
        if (!validateMeasurementInput(measurement)) {
            return res.status(400).json({ error: 'Invalid input' });
        }
        const newMeasurement = await measurementService.createMeasurement(measurement);
        res.status(201).json(newMeasurement);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getMeasurementsByUserId,
    createMeasurement,
    updateMeasurement
};