const knex = require('../utils/db');
const { v4: uuidv4 } = require("uuid");


//  Add get User UOM, Update UOM

const addUOM = async (uomEntries) => {
    if (!Array.isArray(uomEntries) || uomEntries.length === 0) {
        throw new Error('Invalid UOM entries. Must be a non-empty array.');
    }

    // Validate each entry in array
    uomEntries.forEach(entry => {
        if (!entry.user_id || !entry.uom_name || !entry.uom) {
            throw new Error('Each UOM entry must have user_id, uom_name, and uom.');
        }
    });

    try {
        // Use a transaction to ensure all inserts are successful
        const insertedEntries = await knex.transaction(async trx => {
            return trx('user_uom')
                .insert(uomEntries.map(entry => ({
                    ...entry,
                    created_on: new Date().toISOString(),
                    updated_on: new Date().toISOString()
                })))
                .returning('*');
        });

        return insertedEntries;

    } catch (error) {
        console.error('Error adding UOM entries:', error);
        throw error;
    }
};

module.exports = {
    addUOM
};