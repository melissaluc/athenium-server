/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('body_composition_log').del()
      .then(function () {
          // Inserts seed entries
          return knex('body_composition_log').insert([
              {
                  id: '11111111-1111-1111-1111-111111111111', // Use UUIDs or generate them dynamically
                  user_id: '39b17fed-61d6-492a-b528-4507290d5423', // Replace with an existing user_id from your 'users' table
                  weight: 133,
                  body_fat: 23,
                  lean_muscle_mass: 90,
                  bmi: 22.5,
                  created_on: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                  updated_on: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
              },
              {
                  id: '22222222-2222-2222-2222-222222222222',
                  user_id: '39b17fed-61d6-492a-b528-4507290d5423', // Replace with another existing user_id
                  weight: 130,
                  body_fat: 23,
                  lean_muscle_mass: 90,
                  bmi: 24.8,
                  created_on: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
                  updated_on: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
              },
              {
                  id: '33333333-3333-3333-3333-333333333333',
                  user_id: '39b17fed-61d6-492a-b528-4507290d5423', // Replace with another existing user_id
                  weight: 129,
                  body_fat: 23,
                  lean_muscle_mass: 92,
                  bmi: 21.1,
                  created_on: new Date(),
                  updated_on: new Date()
              }
          ]);
      });
};