// models/measurementModel.js
const config = require("../knexfile.js");
const { error } = require("console");
const knex = require("knex")(config.development);

const { v4: uuidv4 } = require('uuid');

const getMeasurementsByUserId = async (userId) => {
    try {
        const measurements = await knex('measurements_log')
            .select(
                'neck_cm',
                'shoulder_cm',
                'chest_cm',
                'abdomen_cm',
                'waist_cm',
                'hip_cm',
                'r_bicep_cm',
                'l_bicep_cm',
                'r_thigh_cm',
                'l_thigh_cm',
                'r_calf_cm',
                'l_calf_cm',
                'created_on',
                'updated_on'
            )
            .where({ user_id: userId });

        return measurements;
    } catch (err) {
        console.error('Error fetching measurements:', err);
        throw err;
    }
}
const createMeasurement = (measurement) => {
    knex('measurements_log')
            .insert(measurement);
            
};
const updateUser = (userId, dateSelected, measurement) => {
    return knex('measurements_log')
        .where({ user_id: userId })
        .andWhere({ created_on: dateSelected })
        .update(measurement)
        .returning('*');
};

module.exports = {
    getMeasurementsByUserId,
    createMeasurement,
    updateUser
};