const knex = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

const createBodyComposition = async (bodyCompositionRecord) => {
    const {} = bodyCompositionRecord
    const id = uuidv4()
    try {
        const bodyComposition = await knex('body_composition_log')
        .insert({
            uid:id,
            ...bodyCompositionRecord
        }).returning('*')
        return bodyComposition

    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }

}

module.exports = {
    createBodyComposition

};