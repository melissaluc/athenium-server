/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('nutrition_log').del()
  await knex('nutrition_log').insert([
  {  
    uid:"850e4309-5ce6-416f-8dc9-90824d283410",
    user_id:"39b17fed-61d6-492a-b528-4507290d5423",
    status:"pending",
    meal:"Lunch",
    food_name:"Chicken Breast",
    dt_planned:new Date('2024-05-01'),
    notes:"Very dry",
    calories:120,
    serving_units:'grams',
    serving:80,
    protein_g:20,
    carbs_g:5,
    fat_g:5,
    created_on:new Date('2024-05-01T00:00:00'),
    updated_on:new Date('2024-05-01T00:00:00')
  }
  ]);
};
