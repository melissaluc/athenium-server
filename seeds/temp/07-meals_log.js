/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('meals_log').del()
      .then(function () {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

          // Inserts seed entries
          return knex('meals_log').insert([
              {
                  uid: '11111111-1111-1111-1111-111111111111', 
                  user_id: '39b17fed-61d6-492a-b528-4507290d5423', 
                  planned_on: new Date('2024-06-19').toISOString().split('T')[0],
                  updated_on: new Date(),
                  meal_name:"lunch",
                  food_name: 'Grilled Chicken Breast',
                  quantity: 1,
                  calories: 200,
                  protein: 30,
                  carbs: 0,
                  fat: 5,
                  uom:"g",
                  created_on: new Date(),
              },
              {
                  uid: '22222222-2222-2222-2222-222222222222',
                  user_id: '39b17fed-61d6-492a-b528-4507290d5423', 
                  planned_on: new Date('2024-06-19').toISOString().split('T')[0],
                  updated_on: new Date(),
                  meal_name:"lunch",
                  food_name: 'Mixed Salad',
                  quantity: 1,
                  calories: 150,
                  protein: 5,
                  carbs: 20,
                  fat: 10,
                  uom:"g",
                  created_on: new Date(),
              },
              {
                  uid: '33333333-3333-3333-3333-333333333333',
                  user_id: '39b17fed-61d6-492a-b528-4507290d5423', 
                  planned_on: new Date('2024-06-19').toISOString().split('T')[0],
                  updated_on: new Date(),
                  meal_name:"breakfast",
                  food_name: 'Oatmeal with Berries',
                  quantity: 1,
                  calories: 300,
                  protein: 10,
                  carbs: 50,
                  fat: 5,
                  uom:"g",
                  created_on: new Date(),
              },
          ]);
      });
};
