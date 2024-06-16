/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('meals_log').del()
      .then(function () {
          // Inserts seed entries
          return knex('meals_log').insert([
              {
                  meal_id: '11111111-1111-1111-1111-111111111111', // Replace with a generated UUID
                  user_id: '39b17fed-61d6-492a-b528-4507290d5423', // Replace with an existing user_id
                  planned_on: new Date(),
                  updated_on: new Date(),
                  food_name: 'Grilled Chicken Breast',
                  quantity: 1,
                  calories: 200,
                  protein: 30,
                  carbs: 0,
                  fat: 5,
                  created_on: new Date(),
                  deleted_on: null
              },
              {
                  meal_id: '22222222-2222-2222-2222-222222222222',
                  user_id: '39b17fed-61d6-492a-b528-4507290d5423', // Replace with an existing user_id
                  planned_on: new Date(),
                  updated_on: new Date(),
                  food_name: 'Mixed Salad',
                  quantity: 1,
                  calories: 150,
                  protein: 5,
                  carbs: 20,
                  fat: 10,
                  created_on: new Date(),
                  deleted_on: null
              },
              {
                  meal_id: '33333333-3333-3333-3333-333333333333',
                  user_id: '39b17fed-61d6-492a-b528-4507290d5423', // Replace with an existing user_id
                  planned_on: new Date(),
                  updated_on: new Date(),
                  food_name: 'Oatmeal with Berries',
                  quantity: 1,
                  calories: 300,
                  protein: 10,
                  carbs: 50,
                  fat: 5,
                  created_on: new Date(),
                  deleted_on: null
              }
          ]);
      });
};
