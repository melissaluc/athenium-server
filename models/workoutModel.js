
const knex = require('../utils/db');

const { v4: uuidv4 } = require('uuid');


const getWorkouts = async (userId, workoutId) => {
    console.log(workoutId)
    try {
        const workouts = await knex('workouts_log')
        .select(
            "uid",
            "user_id",
            "created_on",
            "updated_on",
            "frequency",
            "workout_name",
            "description",
            "tags",
            knex.raw("EXTRACT(epoch FROM last_completed)::int AS last_completed"),
            knex.raw("EXTRACT(epoch FROM created_on)::int AS created_on_unix"),
            knex.raw("EXTRACT(epoch FROM updated_on)::int AS updated_on_unix")
        )
        .where({ user_id: userId })
        .andWhere(builder => {
            if (workoutId) {
                builder.andWhere({ uid: workoutId });
            }
        });
            
            const exercises = await knex('workout_exercises')
            .select(
                'uid',
                'workout_id',
                'exercise_name',
                'category',
                'group',
                'weight',
                'reps',
                'sets',
                'duration',
                'distance',
                'img_url',
                "created_on",
                "updated_on"
            )
            
            // Combine workouts with their exercises
            const combinedData = workouts.map(workout => {
                
                return {
                    workout_id: workout.uid,
                    last_completed: workout.last_completed,
                    created_on: workout.created_on,
                    frequency: workout.frequency,
                    workout_name: workout.workout_name,
                    description: workout.description,
                    tags: workout.tags,
                    exercises : exercises.filter(exercise => (exercise.workout_id === workout.uid))
                    .map(exercise => {
                        return {
                            id: exercise.uid,
                            img_url: exercise.img_url,
                            category:exercise.category,
                            group:exercise.group,
                            exercise_name: exercise.exercise_name,
                            weight: exercise.weight,
                            reps: exercise.reps,
                            sets: exercise.sets,
                            duration: exercise.duration,
                            distance: exercise.distance
                        }
                    })
                }
            })
            
            return combinedData;
        } catch (err) {
            console.error('Error fetching workouts data:', err);
            throw err;
        }
    }
    
const createWorkout = async (userId, workout) => {
    try {
        
        const id = uuidv4();
        // const createdOnDate = new Date(dateSelected * 1000).toISOString();
        
        // Insert new measurement with previous values
        const insertedWorkout = await knex('workouts_log')
        .insert({
            uid: id,
            user_id: userId,
            workout_name:workout.workout_name,
            description:workout.description,
            last_completed:workout.last_completed || null,
            created_on:knex.fn.now(),
            updated_on:knex.fn.now(),
            frequency:workout.frequency || 0,
            tags:JSON.stringify(workout.tags),
        })
        .returning('*');
        const { uid, user_id, ...rest } = insertedWorkout[0];
        return {workout_id: uid, ...rest };
    } catch (error) {
        console.error('Error logging measurement:', error);
        throw error; // Rethrow the error to handle it further up the chain
    }
};
    
const updateWorkout = async (userId, workoutId, updateData) => {
    console.log('update data:', updateData);
    const { addedExercises, deletedExercises, updatedExercises, updatedWorkoutDetails } = updateData;

    try {
        await knex.transaction(async (trx) => {
            // Handle added exercises
            if (addedExercises) {
                for (const [id, exercise] of Object.entries(addedExercises)) {
                    if (exercise.weight !== '' || exercise.reps !== '' || exercise.sets !== '' || exercise.duration !== '' || exercise.distance !== '') {
                        const weightNumber = parseFloat(exercise.weight) || 0;
                        const repsNumber = parseInt(exercise.reps) || 0;
                        const setsNumber = parseInt(exercise.sets) || 0;
                        const distanceNumber = parseFloat(exercise.distance) || 0; 
                        const durationNumber = parseFloat(exercise.duration) || 0; 
                        
                        await trx("workout_exercises").insert({
                            uid: id,
                            workout_id: workoutId,
                            exercise_name: exercise.exercise_name,
                            category: exercise.category,
                            group: exercise.group,
                            weight: weightNumber,
                            reps: repsNumber,
                            sets: setsNumber,
                            duration: durationNumber,
                            distance: distanceNumber,
                            img_url: exercise.img_url || null,
                            created_on: knex.fn.now(),
                            updated_on: knex.fn.now()
                        });
                    }
                }
            }

            // Handle deleted exercises
            if (deletedExercises && deletedExercises.length > 0) {
                await trx('workout_exercises')
                    .whereIn('uid', deletedExercises)
                    .delete();
            }

            // Handle updated exercises
            if (updatedExercises) {
                for (const [id, exercise] of Object.entries(updatedExercises)) {
                    const weightNumber = exercise.weight !== '' ? parseFloat(exercise.weight) : null;
                    const repsNumber = exercise.reps !== '' ? parseInt(exercise.reps) : null;
                    const setsNumber = exercise.sets !== '' ? parseInt(exercise.sets) : null;
                    const distanceNumber = exercise.distance !== '' ? parseFloat(exercise.distance) : null;
                    const durationNumber = exercise.duration !== '' ? parseFloat(exercise.duration) : null;

                    const updateFields = { updated_on: knex.fn.now() };

                    if (repsNumber !== null) updateFields.reps = repsNumber;
                    if (setsNumber !== null) updateFields.sets = setsNumber;
                    if (weightNumber !== null) updateFields.weight = weightNumber;
                    if (durationNumber !== null) updateFields.duration = durationNumber;
                    if (distanceNumber !== null) updateFields.distance = distanceNumber;

                    if (Object.keys(updateFields).length > 1) {
                        await trx('workout_exercises')
                            .where('uid', id)
                            .update(updateFields);
                    }
                }
            }

            // Update workout details if necessary
            const workoutUpdates = {};
            const date = new Date(updatedWorkoutDetails.last_completed);
            const lastUpdatedIsoString = date.toISOString();

            if (updatedWorkoutDetails.workout_name) workoutUpdates.workout_name = updatedWorkoutDetails.workout_name;
            if (updatedWorkoutDetails.description) workoutUpdates.description = updatedWorkoutDetails.description;
            if (updatedWorkoutDetails.last_completed) workoutUpdates.last_completed = lastUpdatedIsoString;
            if (updatedWorkoutDetails.frequency) workoutUpdates.frequency = updatedWorkoutDetails.frequency;

            if (Object.keys(workoutUpdates).length > 0) {
                workoutUpdates.updated_on = knex.fn.now();
                await trx('workouts_log')
                    .where({ user_id: userId, uid: workoutId })
                    .update(workoutUpdates);
            }

            // Commit the transaction
            await trx.commit();
            console.log("Transaction committed successfully.");
        });

        // Return updated workout data if needed
        const updatedWorkout = await knex('workouts_log')
            .where({ user_id: userId, uid: workoutId })
            .first();
        
        return updatedWorkout; // Return the updated workout
    } catch (error) {
        console.error('Error updating workout:', error);
        throw error; // Ensure error is propagated
    }
};

    
const deleteWorkout = async (userId, workoutId) => {
    try {
        await knex.transaction(async (trx) => {
            await trx('workout_exercises')
            .where('uid', workoutId)
            .delete();
            
            await trx('workouts_log')
            .where('user_id',userId)
            .andWhere('uid', workoutId)
            .delete();
            
            await trx.commit();
            console.log("Transaction committed successfully.");
            return {success:true, msg:'Transaction committed successfully.'}
        })
    } catch (error) {
        console.error('Error deleting workout:', error);
        throw error;
    }
}



module.exports = {
    getWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout


};