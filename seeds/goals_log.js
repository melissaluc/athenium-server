/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('goals_log').del()
  await knex('goals_log').insert([
  {    
    uid:"1a9738a9-e9c1-4f71-bc98-3a7b625583ff",
    user_id:"39b17fed-61d6-492a-b528-4507290d5423",
    status:"pending",
    goal_name:"Gain 10lbs of Muscle",
    dt_start:new Date('2024-05-01T00:00:00'),
    dt_end:new Date('2025-05-01T00:00:00'),
    description:"Work on building strength and muscles",
    category:"body recomposition",
    metric:"body fat",
    metric_units:"percentage",
    metric_value:-5,
    priority_level:10,
    rank:1,
    created_on:new Date('2024-05-01T00:00:00'),
    updated_on:new Date('2024-05-01T00:00:00')
  }
  ]);
};
