const addUOM = async (uomEntries, trx) => {
    if (!Array.isArray(uomEntries) || uomEntries.length === 0) {
        throw new Error('Invalid UOM entries: Must be a non-empty array.');
    }

    // Validate each entry in array
    uomEntries.forEach(entry => {
        if (!entry.user_id || !entry.uom_name || !entry.uom) {
            throw new Error(`Invalid UOM entry: Missing user_id, uom_name, or uom. Entry: ${JSON.stringify(entry)}`);
        }
    });

    try {
        // Use the provided transaction (trx)
        const insertedEntries = await trx('user_uom')
            .insert(uomEntries.map(entry => ({
                ...entry,
                created_on: new Date().toISOString(),
                updated_on: new Date().toISOString()
            })))
            .returning('*');

        return insertedEntries;
    } catch (error) {
        console.error('Error adding UOM entries:', error.message || error);
        throw new Error('Failed to add UOM entries. Please check the server logs for more details.');
    }
};

module.exports = {
    addUOM
};
