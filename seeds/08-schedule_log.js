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
      activity_id: '00000000-0000-0000-0000-000000000001', 
      activity_type:'workout',
      activity_name: 'Super Back',
      activity_category: 'Strength',
      planned_on: new Date('2024-06-19T06:00:00').toISOString(),
      created_on: new Date(),
      updated_on: new Date()
    },
    {
      uid: '22222222-2222-2222-2222-222222222222',
      user_id: '39b17fed-61d6-492a-b528-4507290d5423',
      activity_id: '00000000-0000-0000-0000-000000000001', 
      activity_type:'workout',
      activity_name: 'Super Back',
      activity_category: 'Strength',
      planned_on: new Date('2024-06-19T13:00:00').toISOString(),
      created_on: new Date(),
      updated_on: new Date()
    },
    {
      uid: '33333333-3333-3333-3333-333333333333',
      user_id: '39b17fed-61d6-492a-b528-4507290d5423',
      activity_id: '00000000-0000-0000-0000-000000000001', 
      activity_type:'workout',
      activity_name: 'Super Back',
      activity_category: 'Strength',
      planned_on: new Date('2024-06-19T18:00:00').toISOString(),
      created_on: new Date(),
      updated_on: new Date()
    }
  ]);
  
  // Insert meals into schedule
  await knex('schedule').insert([
    {
      uid: '44444444-4444-4444-4444-444444444444',
      user_id: '39b17fed-61d6-492a-b528-4507290d5423',
      activity_id: '44444444-4444-4444-4444-444444444444', 
      activity_type:'meal',
      activity_name: 'breakfast',
      activity_category: 'Food',
      planned_on: new Date('2024-06-19T08:00:00').toISOString(),
      created_on: new Date(),
      updated_on: new Date()
    },
    {
      uid: '55555555-5555-5555-5555-555555555555',
      user_id: '39b17fed-61d6-492a-b528-4507290d5423',
      activity_id: '55555555-5555-5555-5555-555555555555', 
      activity_type:'meal',
      activity_name: 'lunch',
      activity_category: 'Food',
      planned_on: new Date('2024-06-19T12:00:00').toISOString(),
      created_on: new Date(),
      updated_on: new Date()
    },
  ]);
};
