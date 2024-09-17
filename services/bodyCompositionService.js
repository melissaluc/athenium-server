const bodyCompositionModel = require('../models/bodyCompositionModel');



const addNewRecord = async (userId, newRecord) => {
    return bodyCompositionModel.addRecord(userId, newRecord);
};



module.exports = {
    addNewRecord
};
