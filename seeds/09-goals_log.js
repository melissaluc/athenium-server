/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('goals_log').del()
      .then(function () {
          // Inserts seed entries
          return knex('goals_log').insert([
              {
                  uid: '11111111-1111-1111-1111-111111111111', // Use UUIDs or generate them dynamically
                  user_id: '39b17fed-61d6-492a-b528-4507290d5423', // Replace with an existing user_id from your 'users' table
                  status: 'in progress',
                  goal_name: 'Lose Weight',
                  start_date: new Date(),
                  achieved_on:null,
                  description: 'Lose 5 kg in 2 months',
                  category: 'Health',
                  metric: 'Weight',
                  uom: 'kg',
                  current_value: 57,
                  start_value:58,
                  target_value:55,
                  priority_level: 1,
                  rank: 1,
                  created_on: new Date(),
                  updated_on: new Date()
              },
              {
                  uid: '22222222-2222-2222-2222-222222222222',
                  user_id: '39b17fed-61d6-492a-b528-4507290d5423', // Replace with another existing user_id
                  status: 'in progress',
                  goal_name: 'Run Marathon',
                  start_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                  achieved_on:null,
                  description: 'Complete a marathon in under 4 hours',
                  category: 'Fitness',
                  metric: 'Time',
                  uom: 'hours',
                  current_value: 4,
                  start_value:2,
                  target_value:45,
                  priority_level: 2,
                  rank: 2,
                  created_on: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                  updated_on: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
              },
              {
                  uid: '33333333-3333-3333-3333-333333333333',
                  user_id: '39b17fed-61d6-492a-b528-4507290d5423', // Replace with another existing user_id
                  status: 'achieved',
                  goal_name: 'Read Books',
                  start_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
                  achieved_on:new Date(Date('2024-05-10') + 20 * 24 * 60 * 60 * 1000),
                  description: 'Read 10 books this year',
                  category: 'Personal Development',
                  metric: 'Books',
                  uom: 'count',
                  current_value: 10,
                  start_value:0,
                  target_value:10,
                  priority_level: 3,
                  rank: 3,
                  created_on: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  updated_on: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              }
          ]);
      });
};
