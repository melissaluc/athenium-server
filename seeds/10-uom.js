/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('user_uom').del()
  await knex('user_uom').insert([
    // Body Composition
    {
      user_id:"39b17fed-61d6-492a-b528-4507290d5423",
      uom_name:"body_mass",
      abbreviation:"body weight",
      uom:"lb",
      description:"",      
      created_on:new Date('2024-05-01T00:00:00'),
      updated_on:new Date('2024-05-01T00:00:00')
    },
    {
      user_id:"39b17fed-61d6-492a-b528-4507290d5423",
      uom_name:"lift_weight",
      abbreviation:"lift",
      uom:"lb",
      description:"",      
      created_on:new Date('2024-05-01T00:00:00'),
      updated_on:new Date('2024-05-01T00:00:00')
    },
    {
      user_id:"39b17fed-61d6-492a-b528-4507290d5423",
      uom_name:"lean_muscle_mass",
      abbreviation:"",
      uom:"lb",
      description:"",      
      created_on:new Date('2024-05-01T00:00:00'),
      updated_on:new Date('2024-05-01T00:00:00')
    },
    {
      user_id:"39b17fed-61d6-492a-b528-4507290d5423",
      uom_name:"height",
      abbreviation:"",
      uom:"ft",
      description:"",      
      created_on:new Date('2024-05-01T00:00:00'),
      updated_on:new Date('2024-05-01T00:00:00')
    },
    {
      user_id:"39b17fed-61d6-492a-b528-4507290d5423",
      uom_name:"girth_measurements",
      abbreviation:"measurement",
      uom:"in",
      description:"",      
      created_on:new Date('2024-05-01T00:00:00'),
      updated_on:new Date('2024-05-01T00:00:00')
    }
  ]);
};



