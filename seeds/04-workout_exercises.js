/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('workout_exercises').del();

  // Inserts seed entries for workout 1
  await knex('workout_exercises').insert([
    {
      uid: '10000000-0000-0000-0000-000000000001',
      workout_id: '00000000-0000-0000-0000-000000000001',
      exercise_name: "lat pull down",
      category: "strength",
      muscle_group: "Back",
      weight: 80,
      reps: 15,
      sets: 5,
      order: 1,
      img_url: null
    },
    {
      uid: '10000000-0000-0000-0000-000000000002',
      workout_id: '00000000-0000-0000-0000-000000000001',
      exercise_name: "deadlift",
      category: "strength",
      muscle_group: "Whole Body",
      weight: 150,
      reps: 15,
      sets: 5,
      order: 2,
      img_url: null
    },
    {
      uid: '10000000-0000-0000-0000-000000000003',
      workout_id: '00000000-0000-0000-0000-000000000001',
      exercise_name: "T-rows",
      category: "strength",
      muscle_group: "Back",
      weight: 60,
      reps: 15,
      sets: 5,
      order: 3,
      img_url: null
    },
    {
      uid: '10000000-0000-0000-0000-000000000004',
      workout_id: '00000000-0000-0000-0000-000000000001',
      exercise_name: "running",
      category: "cardio",
      weight: null,
      reps: null,
      sets: null,
      duration: null,
      distance: 10,
      order: 4,
      img_url: null
    },
    {
      uid: '10000000-0000-0000-0000-000000000005',
      workout_id: '00000000-0000-0000-0000-000000000001',
      exercise_name: "swimming",
      category: "cardio",
      weight: null,
      reps: null,
      sets: null,
      duration: 60,
      distance: null,
      order: 5,
      img_url: null
    }
  ]);

  // Inserts seed entries for workout 2
  await knex('workout_exercises').insert([
    {
      uid: '20000000-0000-0000-0000-000000000001',
      workout_id: '00000000-0000-0000-0000-000000000002',
      exercise_name: "running",
      category: "cardio",
      weight: null,
      reps: null,
      sets: null,
      duration: null,
      distance: 10,
      order: 1,
      img_url: null
    }
  ]);
};
