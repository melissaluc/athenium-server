const knex = require('../utils/db');
const { v4: uuidv4 } = require("uuid");

const getScheduleByUserId = async (userId) => {
  console.log("userid", userId);
  try {
    const schedule = await knex("schedule")
      .select(
        "schedule.uid as uid",
        "activity_id",
        "activity_type",
        "activity_name",
        "activity_category",
        "planned_on"
        // knex.raw(
        //   "EXTRACT(epoch FROM schedule.planned_on)::int AS planned_on"
        // )
      )
      .where({ user_id: userId });

    const workouts = await knex("workouts_log")
      .select("uid", "workout_name")
      .where({ user_id: userId });

    const exercises = await knex("workout_exercises")
      .select("workout_id", "exercise_name")
      .whereIn(
        "workout_id",
        workouts.map((workout) => workout.uid)
      );

    const meals = await knex("meals_log")
      .select(
        "meal_name",
        "planned_on",
        knex.raw("ARRAY_AGG(food_name) as food_list"), // Using ARRAY_AGG to aggregate food_name into an array
        knex.raw("SUM(calories) as total_calories"), // Aggregating calories
        knex.raw("SUM(protein) as total_protein"), // Aggregating protein
        knex.raw("SUM(carbs) as total_carbs"), // Aggregating carbs
        knex.raw("SUM(fat) as total_fat") // Aggregating fat
      )
      .where({ user_id: userId })
      .groupBy("meal_name", "planned_on") // Group by appropriate columns
      .orderBy("meal_name", "asc");

    
    // Combine workouts and exercises
    const workoutsExercises = workouts.reduce((acc, workout) => {

        const existingWorkout = acc.find(item => item.uid === workout.uid);
      
        if (existingWorkout) {
          existingWorkout.exercise_list.push(workout.exercise_name);
        } else {
          acc.push({
            uid: workout.uid,
            workout_name: workout.workout_name,
            exercise_list: [] 
          });
        }
      
        return acc;
      }, []);

      exercises.forEach(exercise => {

            const workoutIndex = workoutsExercises.findIndex(item => item.uid === exercise.workout_id);
    
            if (workoutIndex !== -1) {
                workoutsExercises[workoutIndex].exercise_list.push(exercise.exercise_name);
                console.log(exercise.exercise_name)
            }

        }
    );
    
    const sendResult = schedule.map((activity) => {
      const result = {
        uid: activity.uid,
        activity_id: activity.activity_id,
        planned_on: activity.planned_on,
        activity_category: activity.activity_type,
        activity_name: activity.activity_name,
      };

    if (activity.activity_type === "meal") {
    meals.map((meal) => {
        const {meal_name,planned_on,food_list,...totals} = meal 

        if (
        meal_name === activity.activity_name &&
        planned_on.toISOString().slice(0, 10) === activity.planned_on.toISOString().slice(0, 10)
        ) {
        result["food_list"]=food_list || []
        result["macros"] = {
            uom:"g",
            data:{
                totals
            }
            }
        }
    });
    } else {
        
        workoutsExercises.map((workout)=>{
            if(workout.uid === activity.activity_id){
                result['exercise_list']=workout.exercise_list || []
            }
        })

    }
    return result

    });

    return sendResult

  } catch (err) {
    console.error("Error fetching measurements:", err);
    throw err;
  }
};

const createSchedule = async (userId, dateSelected, measurement) => {
  try {
    const id = uuidv4();

    // // Convert Unix timestamp (seconds) to ISO 8601 string
    // const createdOnDate = new Date(dateSelected * 1000).toISOString();

    // Fetch the most recent measurements for the user
    const prevSchedules = await knex("measurements_log")
      .select("weight_kg", "musclemass_kg", "bf_percentage")
      .where("user_id", userId)
      .orderBy("created_on", "desc")
      .limit(1)
      .first();

    // Insert new measurement with previous values
    const insertedSchedule = await knex("measurements_log")
      .insert({
        uid: id,
        user_id: userId,
        ...measurement,
        created_on: dateSelected,
        updated_on: knex.fn.now(),
        weight_kg: prevSchedules ? prevSchedules.weight_kg : null,
        musclemass_kg: prevSchedules ? prevSchedules.musclemass_kg : null,
        bf_percentage: prevSchedules ? prevSchedules.bf_percentage : null,
      })
      .returning("*");

    return insertedSchedule;
  } catch (error) {
    console.error("Error logging measurement:", error);
    throw error; // Rethrow the error to handle it further up the chain
  }
};

const updateUser = (userId, dateSelected, measurement) => {
  measurement.updated_on = new Date().toISOString();

  return knex("measurements_log")
    .where({ user_id: userId })
    .andWhere({ created_on: dateSelected })
    .update(measurement)
    .returning("*");
};

module.exports = {
  getScheduleByUserId,
  createSchedule,
  updateUser,
};
