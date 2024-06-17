// models/measurementModel.js
const config = require("../knexfile.js");
const { error } = require("console");
const knex = require("knex")(config.development);

const { v4: uuidv4 } = require('uuid');

const getWorkoutsByUserId = async (userId) => {
    try {
        const workouts = await knex('workouts_log')
            .select(
                "uid",
                "user_id",
                "last_completed",
                "created_on",
                "updated_on",
                "frequency",
                "workout_name",
                "description",
                "tags",
                // knex.raw("EXTRACT(epoch FROM created_on)::int AS created_on_unix"),
                // knex.raw("EXTRACT(epoch FROM updated_on)::int AS updated_on_unix")
            )
            .where({ user_id: userId });
            
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
                last_completed:workout.last_completed,
                created_on:knex.fn.now(),
                updated_on:knex.fn.now(),
                frequency:workout.frequency,
                tags:JSON.stringify(workout.tags),
            })
            .returning('*');
            
            return insertedWorkout;
        } catch (error) {
            console.error('Error logging measurement:', error);
            throw error; // Rethrow the error to handle it further up the chain
        }
    };
    
    const updateWorkout = async (userId, workoutData) => {

        const { uid: workout_id, workout_name, description, updatedExercises, addedExercises, deletedExercises } = workoutData;
        try {
            await knex.transaction(async (trx) => {
                // Handle added exercises
                if (addedExercises && addedExercises.length > 0) {
                    for (const exercise of addedExercises) {
                        const id = uuidv4(); // Generate a new UUID for all added exercises
                        await trx("workout_exercises").insert({
                            uid: id,
                            workout_id: workout_id,
                            ...exercise,
                            created_on: knex.fn.now(),
                            updated_on: knex.fn.now()
                        });
                    }
                }
    
                // Handle deleted exercises
                if (deletedExercises && deletedExercises.length > 0) {
                    await trx('workout_exercises')
                        .whereIn('uid', deletedExercises)
                        .delete();
                }
    
                // Handle updated exercises
                if (updatedExercises && updatedExercises.length > 0) {
                    for (const exercise of updatedExercises) {
                        const updateFields = {
                            updated_on: knex.fn.now()
                        };
                        
                        if (exercise.category === 'strength') {
                            updateFields.reps = exercise.reps;
                            updateFields.sets = exercise.sets;
                            updateFields.weight = exercise.weight;
                        } else if (exercise.category === 'cardio') {
                            updateFields.duration = exercise.duration;
                            updateFields.distance = exercise.distance;
                            updateFields.sets = exercise.sets;
                        }
                        await trx('workout_exercises')
                            .where('uid', exercise.uid)
                            .update(updateFields);
                    }
                }
                
    
                // Update workout details if workout_name or description changed
                const workoutUpdates = {};
                if (workout_name) {
                    workoutUpdates.workout_name = workout_name;
                }
                if (description) {
                    workoutUpdates.description = description;
                }
                if (Object.keys(workoutUpdates).length > 0) {
                    workoutUpdates.updated_on = knex.fn.now();
                    await trx('workouts_log')
                        .where({ user_id: userId, uid: workout_id })
                        .update(workoutUpdates);
                }
    
                // Commit the transaction
                await trx.commit();
                console.log("Transaction committed successfully.");
            });
    
            // Return updated workout data if needed
            const updatedWorkout = await knex('workouts_log')
                .where({ user_id: userId, uid: workout_id })
                .first();
            return updatedWorkout;
        } catch (error) {
            console.error('Error updating workout:', error);
            throw error;
        }
    };

module.exports = {
    getWorkoutsByUserId,
    createWorkout,
    updateWorkout

};