/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('workouts_log').del();
  await knex('workouts_log').insert([
    {
      uid: '11111111-1111-1111-1111-111111111111',
      user_id: '39b17fed-61d6-492a-b528-4507290d5423',
      workout_name: 'Morning Workout',
      exercise_name: 'Push-up',
      planned_on: new Date('2024-06-01T08:00:00'),
      status: 'completed',
      last_completed: new Date('2024-06-01T08:30:00'),
      description: 'Morning push-up routine',
      tags: 'morning,strength',
      created_on: new Date(),
      updated_on: new Date()
    },
    {
      uid: '22222222-2222-2222-2222-222222222222',
      user_id: '39b17fed-61d6-492a-b528-4507290d5423',
      workout_name: 'Evening Workout',
      exercise_name: 'Squat',
      planned_on: new Date('2024-06-01T18:00:00'),
      status: 'completed',
      last_completed: new Date('2024-06-01T18:30:00'),
      description: 'Evening squat routine',
      tags: 'evening,legs',
      created_on: new Date(),
      updated_on: new Date()
    },
    {
      uid: '33333333-3333-3333-3333-333333333333',
      user_id: '39b17fed-61d6-492a-b528-4507290d5423',
      workout_name: 'Afternoon Workout',
      exercise_name: 'Deadlift',
      planned_on: new Date('2024-06-02T14:00:00'),
      status: 'planned',
      last_completed: null,
      description: 'Afternoon deadlift session',
      tags: 'afternoon,back',
      created_on: new Date(),
      updated_on: new Date()
    }
  ]);
};
