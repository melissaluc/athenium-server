/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('workouts_log').del()
  await knex('workouts_log').insert([
    {
      uid:"bc8b8bb6-f882-4448-a36c-db6c7c43ce08", 
      user_id:'39b17fed-61d6-492a-b528-4507290d5423',
      workout_name:"Leg Day",
      exercise_name:"Hip Extension",
      dt_planned:new Date('2024-05-01T00:00:00'),
      status:"pending",
      weight_kg: 45.3592,
      reps:15,
      order:1,
      created_on:new Date('2024-05-01T00:00:00'),
      updated_on:new Date('2024-05-01T00:00:00')
    }
  ]);
};
