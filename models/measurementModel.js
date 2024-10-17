const knex = require('../utils/db');

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
                'r_upper_thigh_cm',
                'l_upper_thigh_cm',
                'r_thigh_cm',
                'l_thigh_cm',
                'r_calf_cm',
                'l_calf_cm',
                'created_on',
                'updated_on'
                // knex.raw("EXTRACT(epoch FROM created_on)::int AS created_on_unix"),
                // knex.raw("EXTRACT(epoch FROM updated_on)::int AS updated_on_unix")
            )
            .where({ user_id: userId });

        return measurements;
    } catch (err) {
        console.error('Error fetching measurements:', err);
        throw err;
    }
}

const createMeasurement = async (userId, dateSelected, measurement) => {
    try {

        const id = uuidv4();

        // Insert new measurement with previous values
        const insertedMeasurement = await knex('measurements_log')
            .insert({
                uid:id,
                user_id: userId,
                ...measurement,
                created_on: dateSelected,
                updated_on: knex.fn.now(),
            })
            .returning('*');

        return insertedMeasurement;
    } catch (error) {
        console.error('Error logging measurement:', error);
        throw error; // Rethrow the error to handle it further up the chain
    }
};

const updateUser = (userId, dateSelected, measurement) => {

    measurement.updated_on = new Date().toISOString();

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