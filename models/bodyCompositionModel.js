const knex = require('../utils/db');

const { v4: uuidv4 } = require('uuid');

const getRecordsByUserId = async () => {

}

const updateRecord = async (userId, newRecord) => {

}   


const addRecord= async (userId, newRecord) => {
    const {body_fat, body_weight, bmr, bmi, ffmi, lean_muscle_mass} = newRecord
    try {

        const id = uuidv4();

        // Insert new measurement with previous values
        const insertedRecord = await knex('body_composition_log')
            .insert({
                uid:id,
                user_id: userId,
                weight:body_weight,
                body_fat,
                lean_muscle_mass,
                bmi,
                ffmi,
                bmr,
                created_on: knex.fn.now(),
                updated_on: knex.fn.now(),
            })
            .returning('*');

        return insertedRecord ;
    } catch (error) {
        console.error('Error logging body composition:', error);
        throw error; // Rethrow the error to handle it further up the chain
    }
};

module.exports = {
    addRecord
};