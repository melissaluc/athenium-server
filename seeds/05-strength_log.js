/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('strength_log').del();
  await knex('strength_log').insert([
    {
      uid: '11111111-1111-1111-1111-111111111111',
      user_id: '39b17fed-61d6-492a-b528-4507290d5423',
      created_on: new Date(),
      calculated_on: new Date('2024-06-01T10:00:00'),
      exercise_name: 'Bench Press',
      category: 'Upper Body',
      body_weight: 70.0,
      relative_strength_demographic: 0.2,
      one_rep_max: 60.0,
      lift: 50.0,
      strength_level: 'beginner',
      next_strength_level: 'novice'
    },
    {
      uid: '22222222-2222-2222-2222-222222222222',
      user_id: '39b17fed-61d6-492a-b528-4507290d5423',
      created_on: new Date(),
      calculated_on: new Date('2024-06-02T12:00:00'),
      exercise_name: 'Squat',
      category: 'Lower Body',
      body_weight: 70.0,
      relative_strength_demographic: 0.35,
      one_rep_max: 100.0,
      lift: 90.0,
      strength_level: 'novice',
      next_strength_level: 'intermediate'
    },
    {
      uid: '33333333-3333-3333-3333-333333333333',
      user_id: '39b17fed-61d6-492a-b528-4507290d5423',
      created_on: new Date(),
      calculated_on: new Date('2024-06-03T14:00:00'),
      exercise_name: 'Deadlift',
      category: 'Full Body',
      body_weight: 70.0,
      relative_strength_demographic: 0.5,
      one_rep_max: 140.0,
      lift: 130.0,
      strength_level: 'intermediate',
      next_strength_level: 'advanced'
    },
    {
      uid: '44444444-4444-4444-4444-444444444444',
      user_id: '39b17fed-61d6-492a-b528-4507290d5423',
      created_on: new Date(),
      calculated_on: new Date('2024-06-04T16:00:00'),
      exercise_name: 'Overhead Press',
      category: 'Upper Body',
      body_weight: 70.0,
      relative_strength_demographic: 0.75,
      one_rep_max: 70.0,
      lift: 65.0,
      strength_level: 'advanced',
      next_strength_level: 'elite'
    },
    {
      uid: '55555555-5555-5555-5555-555555555555',
      user_id: '39b17fed-61d6-492a-b528-4507290d5423',
      created_on: new Date(),
      calculated_on: new Date('2024-06-05T18:00:00'),
      exercise_name: 'Pull-up',
      category: 'Upper Body',
      body_weight: 70.0,
      relative_strength_demographic: 0.9,
      one_rep_max: 50.0,
      lift: 45.0,
      strength_level: 'elite',
      next_strength_level: 'elite'
    }
  ]);
};
