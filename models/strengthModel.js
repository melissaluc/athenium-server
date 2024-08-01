const knex = require('../utils/db.js');
const { v4: uuidv4 } = require('uuid');

const calculateStrength = require('./strengthCalculator/calculateStrength.js')

const getStrengthRecords = async (userId) => {
    try {
        // Raw sql query
        const sqlQuery = `
            SELECT
                sl.calculated_on AS date_calculated,
                sl.exercise_name,
                ex.img_url,
                sl.category,
                sl.group,
                sl.body_weight,
                sl.relative_strength_demographic,
                ld.work_volume,
                sl.lift,
                sl.reps,
                sl.one_rep_max,
                sl.strength_level,
                sl.next_strength_level,
                sl.strength_bounds
            FROM
                strength_log AS sl
            INNER JOIN (
                SELECT
                    ld.exercise_name,
                    ld.group,
                    MAX(ld.calculated_on) AS last_calculated,
                    MAX(ld.sets * ld.reps * ld.lift) AS work_volume
                FROM
                    strength_log AS ld
                WHERE
                    ld.user_id = ?
                GROUP BY
                    ld.exercise_name,
                    ld.group
            ) AS ld ON sl.exercise_name = ld.exercise_name AND sl.calculated_on = ld.last_calculated
            LEFT JOIN (
                SELECT DISTINCT
                    ex.exercise_name,
                    ex.group,
                    ex.img_url
                FROM
                    workout_exercises AS ex
                WHERE
                    ex.img_url IS NOT NULL
            ) AS ex ON sl.exercise_name = ex.exercise_name AND sl.group = ex.group
        `;

        // Execute the raw sql query
        const result = await knex.raw(sqlQuery, [userId]);

        // Extract the rows from result obj
        const latestRecords = result.rows;
        const sendResult = {}
        const proficiencyLevels = {
            "beginner": 1,
            "novice": 2,
            "intermediate": 3,
            "advanced": 4,
            "elite": 5
        };
        
        latestRecords.map(exercise => {
            let normalizedScore
            if(exercise.strength_bounds) {

                const strength_bounds = exercise.strength_bounds
                const current_strength_level = exercise.strength_level
                const next_strength_level = exercise.next_strength_level
                // Values
                const strengthLevel = strength_bounds[current_strength_level]
                const proficiencyScore = proficiencyLevels[current_strength_level]
                if(strength_bounds[next_strength_level]){
                    const nextStrengthLevel = strength_bounds[next_strength_level]
                    // const score = proficiencyScore*((exercise.one_rep_max - strengthLevel)/(nextStrengthLevel-strengthLevel))
                    normalizedScore = proficiencyScore + ((exercise.one_rep_max - strengthLevel)/(nextStrengthLevel-strengthLevel))
                    // console.log(`
                    //     ${exercise.exercise_name}
                    //     \n${current_strength_level}: ${proficiencyScore} 
                    //     \n normalized score: ${normalizedScore}
                    //     \n onerepmax: ${exercise.one_rep_max}
                    //     \n nextstrengthlevel: ${next_strength_level}
                    //     `)
                } else {
                    normalizedScore = 5 + (exercise.one_rep_max/strength_bounds[current_strength_level])
                }
                exercise.score = normalizedScore
                
                if(!sendResult[exercise.group]){
                    sendResult[exercise.group] = []
                    sendResult[exercise.group].push(exercise)
                } else {
                    sendResult[exercise.group].push(exercise)
                }
            }
        })
        
        Object.keys(sendResult).forEach(group => {
            sendResult[group].sort((a, b) => b.score - a.score);
        });

        

        console.log(sendResult)
        

        return sendResult;

    } catch (error) {
        console.error('Error fetching strength records:', error);
        throw error;
    }
};



const createStrengthRecord = async (userId, data) => {
    console.log('Entering createStrengthRecord function');

    try {
        // Call retrieveStrengthLevel to get strength data
        const result = await calculateStrength.retrieveStrengthLevel(data.age, "female", data.body_weight, data.weight, data.reps, data.exercise_name, data.lift_uom, data.body_mass_uom)
        console.log('Retrieved strength result:', result);
        
        // Check if result is valid before proceeding
        if (result) {
            // Check if a record already exists for the current user_id and calculated_on date
            const existingRecord = await knex('strength_log')
                .where('user_id', userId)
                .andWhere({exercise_name:data.exercise_name})
                .andWhere({group:data.group})
                .andWhereRaw("DATE(calculated_on) = DATE(CURRENT_TIMESTAMP)")
                .first();
            console.log('Existing record:', existingRecord);

            if (existingRecord) {
                // Update existing record
                const updatedStrength = await knex('strength_log')
                    .where('uid', existingRecord.uid) // Assuming 'uid' is the primary key
                    .update({
                        exercise_name: data.exercise_name,
                        body_weight: result.body_weight,
                        relative_strength_demographic: result.relative_strength_demographic,
                        one_rep_max: result.one_rep_max,
                        lift: data.weight,
                        sets:data.sets,
                        reps:data.reps,
                        strength_level: result.strengthLevel,
                        next_strength_level: result.next_strength_level,
                        strength_bounds: JSON.stringify(result.strengthBounds),
                        calculated_on: knex.fn.now(),
                    })
                    .returning('*');
                console.log('Updated data:', updatedStrength);
                return updatedStrength;
            } else {
                const id = uuidv4()
                // Insert new record if no existing record found for today
                const insertedStrength = await knex('strength_log')
                    .insert({
                        uid:id,
                        user_id: userId,
                        exercise_name: data.exercise_name,
                        category: data.category,
                        body_weight: result.body_weight,
                        relative_strength_demographic: result.relative_strength_demographic,
                        one_rep_max: result.one_rep_max,
                        lift: data.weight,
                        sets:data.sets,
                        reps:data.reps,
                        group:data.group,
                        strength_level: result.strengthLevel,
                        next_strength_level: result.next_strength_level,
                        strength_bounds:JSON.stringify(result.strengthBounds),
                        calculated_on: knex.fn.now(),
                        created_on: knex.fn.now(),
                    })
                    .returning('*');
                console.log('Inserted data:', insertedStrength);
                return insertedStrength;
            }
        }
    } catch (error) {
        console.error('Error updating strength record:', error);
        throw error; // Rethrow the error to propagate it up the call stack
    }
};

    


module.exports = {
    getStrengthRecords,
    createStrengthRecord,



};