const scheduleModel = require('../models/scheduleModel');


const getByUserId = async (id) => {
    return scheduleModel.getScheduleByUserId(id);
};

const createScheduleByUser = async (userId, dateSelected, schedules) => {
    return scheduleModel.createSchedule(userId, dateSelected, schedules);
};

const updateByUserId = async (id, dateSelected, schedules) => {
    return scheduleModel.updateUser(id, dateSelected, schedules);
};



module.exports = {
    getByUserId,
    createScheduleByUser,
    updateByUserId,
};
