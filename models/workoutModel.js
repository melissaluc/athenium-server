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
                'muscle_group',
                'weight',
                'reps',
                'sets',
                'duration',
                'distance',
                'img_url',
                'order',
                "created_on",
                "updated_on"
                )

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
                                                group:exercise.muscle_group,
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

const createWorkout = async (userId, dateSelected, measurement) => {
    try {

        const id = uuidv4();

        // // Convert Unix timestamp (seconds) to ISO 8601 string
        // const createdOnDate = new Date(dateSelected * 1000).toISOString();

        // Fetch the most recent measurements for the user
        const prevMeasurements = await knex('measurements_log')
            .select('weight_kg', 'musclemass_kg', 'bf_percentage')
            .where('user_id', userId)
            .orderBy('created_on', 'desc')
            .limit(1)
            .first(); 

        // Insert new measurement with previous values
        const insertedMeasurement = await knex('measurements_log')
            .insert({
                uid:id,
                user_id: userId,
                ...measurement,
                created_on: dateSelected,
                updated_on: knex.fn.now(),
                weight_kg: prevMeasurements ? prevMeasurements.weight_kg : null,
                musclemass_kg: prevMeasurements ? prevMeasurements.musclemass_kg : null,
                bf_percentage: prevMeasurements ? prevMeasurements.bf_percentage : null
            })
            .returning('*');

        return insertedMeasurement;
    } catch (error) {
        console.error('Error logging measurement:', error);
        throw error; // Rethrow the error to handle it further up the chain
    }
};

const updateUser = (userId, dateSelected, measurement) => {

    measurement.updated_on = new Date().toISOString();

    return knex('measurements_log')
        .where({ user_id: userId })
        .andWhere({ created_on: dateSelected })
        .update(measurement)
        .returning('*');
};

module.exports = {
    getWorkoutsByUserId,
    createWorkout,
    updateUser
};