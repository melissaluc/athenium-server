/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('schedule').del();
  
  // Insert workouts into schedule
  await knex('schedule').insert([
    {
      uid: '11111111-1111-1111-1111-111111111111',
      user_id: '39b17fed-61d6-492a-b528-4507290d5423',
      activity_id: '11111111-1111-1111-1111-111111111111', 
      activity_type:'workout',
      activity_name: 'Morning Workout',
      activity_category: 'Strength',
      planned_time: new Date('2024-06-15T07:00:00'),
      created_on: new Date(),
      updated_on: new Date()
    },
    {
      uid: '22222222-2222-2222-2222-222222222222',
      user_id: '39b17fed-61d6-492a-b528-4507290d5423',
      activity_id: '22222222-2222-2222-2222-222222222222', 
      activity_type:'workout',
      activity_name: 'Evening Workout',
      activity_category: 'Strength',
      planned_time: new Date('2024-06-15T18:00:00'),
      created_on: new Date(),
      updated_on: new Date()
    },
    {
      uid: '33333333-3333-3333-3333-333333333333',
      user_id: '39b17fed-61d6-492a-b528-4507290d5423',
      activity_id: '33333333-3333-3333-3333-333333333333', 
      activity_type:'workout',
      activity_name: 'Afternoon Workout',
      activity_category: 'Strength',
      planned_time: new Date('2024-06-16T14:00:00'),
      created_on: new Date(),
      updated_on: new Date()
    }
  ]);
  
  // Insert meals into schedule
  await knex('schedule').insert([
    {
      uid: '44444444-4444-4444-4444-444444444444',
      user_id: '39b17fed-61d6-492a-b528-4507290d5423',
      activity_id: '11111111-1111-1111-1111-111111111111', 
      activity_type:'meal',
      activity_name: 'Breakfast',
      activity_category: 'Food',
      planned_time: new Date('2024-06-15T08:00:00'),
      created_on: new Date(),
      updated_on: new Date()
    },
    {
      uid: '55555555-5555-5555-5555-555555555555',
      user_id: '39b17fed-61d6-492a-b528-4507290d5423',
      activity_id: '22222222-2222-2222-2222-222222222222', 
      activity_type:'meal',
      activity_name: 'Lunch',
      activity_category: 'Food',
      planned_time: new Date('2024-06-15T12:00:00'),
      created_on: new Date(),
      updated_on: new Date()
    },
    {
      uid: '66666666-6666-6666-6666-666666666666',
      user_id: '39b17fed-61d6-492a-b528-4507290d5423',
      activity_id: '33333333-3333-3333-3333-333333333333', 
      activity_type:'meal',
      activity_name: 'Dinner',
      activity_category: 'Food',
      planned_time: new Date('2024-06-15T18:00:00'),
      created_on: new Date(),
      updated_on: new Date()
    }
  ]);
};
