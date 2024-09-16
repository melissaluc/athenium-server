const knex = require('../utils/db.js');
const { v4: uuidv4 } = require('uuid');

const {calculateStrength} = require('./strengthCalculator/calculateStrength.js')


const getExerciseRecords = async (userId, exerciseName, trx) => {
    // const formatExerciseName = exerciseName.toLowerCase() 
    //                             .replace(/-/g, ' ')
    //                             .replace(/\b\w/g, char => char.toUpperCase());
    try {

        const strengthLog = await knex('strength_log')
                        .select(
                        'uid',
                        'calculated_on',
                        'created_on',
                        'exercise_name',
                        'body_weight',
                        'group',
                        'category',
                        "relative_strength_demographic",
                        "one_rep_max",
                        "lift",
                        "sets",
                        "reps",
                        "strength_level",
                        "next_strength_level",
                        "strength_bounds"
                        )
                        .where({user_id:userId})
                        .andWhere({exercise_name: exerciseName})
                        .orderBy('created_on', 'desc')

        return strengthLog
    } catch (error) {
        console.error(error)
    }
}

const getStrengthRecords = async (userId) => {
    try {
        // Raw sql query
        const sqlQuery = `
            SELECT
                sl.created_on AS date_calculated,
                sl.exercise_name,
                ex.img_url,
                sl.category,
                sl.group,
                sl.body_weight,
                sl.relative_strength_demographic,
                ld.work_volume,
                sl.lift,
                sl.reps,
                sl.sets,
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
                console.log(strength_bounds, current_strength_level)
                if(strength_bounds[next_strength_level] && current_strength_level!='elite'){
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
                    normalizedScore = 5 + (exercise.one_rep_max/strengthLevel)
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


const createStrengthRecord = async (userId, data, trx) => {
    console.log('Entering createStrengthRecord function: ',data);

    try {
        // Call retrieveStrengthLevel to get strength data
        const lift = data.weight || data.lift;
        const result = await calculateStrength(
                                            data.gender, 
                                            data.age, 
                                            data.body_weight, 
                                            'lb',// data.body_mass_uom, 
                                            data.exercise_name, 
                                            lift,
                                            'lb',// data.lift_uom,
                                            data.sets || 0,
                                            data.reps,
                                            data?.variation || null,
                                            data?.assistanceMass || null,
                                            data?.extraMass || null
                                            )

        console.log('Retrieved strength result:', result);
        
        // Check if result is valid before proceeding
        if (result) {
            // Check if a record already exists for the current user_id and calculated_on date
            let query = knex('strength_log')
            .where('user_id', userId)
            .andWhere('exercise_name', data.exercise_name)


            if (data.uid) {
                query = query.andWhere('uid', data.uid);
            } else {
                query = query.andWhereRaw("DATE(created_on) = DATE(CURRENT_DATE)");
            }

            let existingRecord = await query.first();
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
                        lift,
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
                        uid:data.uid || id,
                        user_id: userId,
                        exercise_name: data.exercise_name,
                        category: data.category,
                        body_weight: result.bodyWeight,
                        relative_strength_demographic: result.relative_strength_demographic,
                        one_rep_max: result.one_rep_max,
                        lift,
                        sets:data.sets,
                        reps:data.reps,
                        group:data.group,
                        strength_level: result.strengthLevel,
                        next_strength_level: result.next_strength_level,
                        strength_bounds:JSON.stringify(result.strengthBounds),
                        calculated_on: knex.fn.now(),
                        created_on: data.created_on || knex.fn.now(),
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

 
const deleteExerciseStrengthRecords = async (userId, exerciseName) => {
    console.log('deleting records for ', exerciseName)
    try {

        const [record] = await knex('strength_log')
            .select('exercise_name')
            .where({'user_id': userId})
            .andWhere('exercise_name', 'ilike', `%${exerciseName}%`)
            .limit(1);

        if (record) {
            await knex('strength_log')
                .where({'user_id': userId})
                .andWhere('exercise_name', 'ilike', `%${exerciseName}%`)
                .del()

                return {success:true, exercise_deleted: record.exercise_name}
        }

        return null

    } catch (error) {
        console.error(error)
    }
}


const updateStrengthRecords = async (userId, exerciseName, updatedData) => {
    const {addedRecords, deletedRecords, unsavedRows: updatedRows, user} = updatedData;
    console.log(updatedData)
    // const {gender, lift_uom, body_mass_uom}= userData

    
    try {
        const result = await knex.transaction(async (trx) => {

            if (updatedRows && Object.keys(updatedRows).length > 0){
                console.log('Updated rows: ', updatedRows)
                const updatedRowsArray = Object.entries(updatedRows);
                for (const [uid, rowData] of updatedRowsArray) {
                    await createStrengthRecord(userId, { ...rowData, ...user }, trx);
                }
                    
            }

            if (deletedRecords && deletedRecords.length > 0) {
                console.log('Attempting to delete Records:', deletedRecords, typeof deletedRecords)

                const deleteQuery = `
                                    DELETE FROM "strength_log"
                                    WHERE "user_id" = ?
                                    AND "uid" IN (?)
                                `;


                const deleteRows = await trx.raw(deleteQuery, [userId, deletedRecords]);
                console.log('Rows Deleted:', deleteRows.rowCount);

                if (deleteRows.rowCount === 0) {
                    console.warn('No rows were deleted. Please verify the query and data.');
                }
            }


            const strengthLog = await getExerciseRecords(userId, exerciseName) 

            return {success:true, msg:'Transaction committed successfully.', log:strengthLog}
            
        })

        console.log('Transaction committed successfully.',result)
        return result

    } catch (error) {
        console.error(`Error ${deletedRecords.length> 0 && 'deleting records, and '} ${Object.keys(updatedRows).length> 0 && 'updating records'}:`, error);
        throw error;
    }

}

module.exports = {
    getStrengthRecords,
    createStrengthRecord,
    getExerciseRecords,
    deleteExerciseStrengthRecords,
    updateStrengthRecords


};