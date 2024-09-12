const knex = require('../utils/db');
const { v4: uuidv4 } = require('uuid');


const updateUserUom= async (userId, newUomData) => {
    //  Setting update (preferred uoms) and personal information
    const updates = [
        {
            uom_name: 'body_mass',
            abbreviation: 'body mass',
            uom: newUomData.body_mass,
            description: '',
        },
        {
            uom_name: 'girth_measurements',
            abbreviation: 'measurements',
            uom: newUomData.length,
            description: '',
        },
        {
            uom_name: 'height',
            abbreviation: 'height',
            uom: newUomData.height,
            description: '',
        },
        {
            uom_name: 'lean_muscle_mass',
            abbreviation: 'llm',
            uom: newUomData.body_mass,
            description: '',
        },
        {
            uom_name: 'lift_weight',
            abbreviation: 'lift',
            uom: newUomData.lift_weight,
            description: '',
        }
    ];
    try {
        for (const update of updates) {
            await knex('user_uom')
                .where({ user_id: userId, uom_name: update.uom_name })
                .update({
                    ...update,
                    updated_on: new Date().toISOString(), // Update the timestamp
                });
        }

        console.log(`User with ID ${userId} has been updated.`);

        return {success: true}

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating user' });
    }

}



module.exports = {
    updateUserUom

};