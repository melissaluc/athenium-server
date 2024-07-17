const knex = require('../db');

const { v4: uuidv4 } = require('uuid');

const putGoalById = async (userId, goalId, updatedGoal) => {
    try {
        const { start_date, updated_on, ...goalData } = updatedGoal;

        // Convert Unix timestamp (seconds) to ISO 8601 string for updated_on
        const isoUpdatedOn = new Date().toISOString();

        // Update goal in the database
        const updatedRows = await knex('goals_log')
            .where({ user_id: userId, uid: goalId })
            .update({
                ...goalData,
                updated_on: isoUpdatedOn,
            })
            .returning('*');

        return updatedRows;
    } catch (error) {
        console.error('Error updating goal:', error);
        throw error; // Rethrow the error to handle it further up the chain
    }
}

const getGoalsByUserId = async (userId) => {
    try {
        const goals = await knex("goals_log")
            .select(
                "uid",
                "user_id",
                "status",
                "goal_name",
                knex.raw("EXTRACT(epoch FROM start_date)::int AS start_date"),
                knex.raw("EXTRACT(epoch FROM achieved_on)::int AS achieved_on"),
                "description",
                "category",
                "metric",
                "uom",
                "current_value",
                "start_value",
                "target_value",
                "priority_level",
                "rank",
                knex.raw("EXTRACT(epoch FROM created_on)::int AS created_on"),
                knex.raw("EXTRACT(epoch FROM updated_on)::int AS updated_on")
                        )
          .where({ user_id: userId })

            return goals;
            
    } catch (err) {
        console.error('Error fetching meals:', err);
        throw err;
    }
}



const addGoal= async (userId, newGoal) => {
    console.log('newGoal modal',newGoal)
    const {start_date,...goalData} = newGoal

    try {

        const id = uuidv4();

        // // Convert Unix timestamp (seconds) to ISO 8601 string
        const isoStartDate = new Date(start_date * 1000).toISOString();
        // const isoUpdatedOn = new Date(updated_on * 1000).toISOString();

        // Insert new measurement with previous values
        const insertedGoal = await knex('goals_log')
            .insert({
                ...goalData,
                user_id:userId,
                start_date:isoStartDate,
                // updated_on:isoUpdatedOn,
                created_on: knex.fn.now(),
                updated_on: knex.fn.now(),
            })
            .returning('*');

        return insertedGoal;
    } catch (error) {
        console.error('Error logging goal:', error);
        throw error; // Rethrow the error to handle it further up the chain
    }
};

const deleteGoal = (userId, goalId) => {
    return knex("goals_log")
        .where({ user_id: userId })
        .andWhere({uid: goalId})
        .del()
};

module.exports = {
    getGoalsByUserId,
    addGoal,
    putGoalById,
    deleteGoal
};