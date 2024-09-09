const userModel = require('../models/userModel');
const userUomModel = require('../models/userUomModel');


const getUser = async (userId) => {
    return userModel.getUser(userId);
};

const updateUser = async (userId, newUserData) => {
    const { uom, ...userData } = newUserData;
    
    const userDataUpdated = { ...userData, updated_on: new Date().toISOString() };

    try {
        const [user, userUom] = await Promise.all([
            userModel.updateUser(userId, userDataUpdated),
            userUomModel.updateUserUom(userId, uom)
        ]);
        console.log('service layer: ',user, userUom, user && userUom)
        if (user && userUom) {
            return getUser(userId);
        } else {
            throw new Error('Update failed for user or UOM');
        }


    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Failed to update user personal information and uom settings');
    }
};



module.exports = {
    getUser,
    updateUser
};
