/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('measurements_log').del()
  await knex('measurements_log').insert([
    {
      uid:"4454438f-263e-4132-abb5-d9ab74700e68",
      user_id:"39b17fed-61d6-492a-b528-4507290d5423",
      weight_kg:54,
      musclemass_kg:43.2,
      bf_percentage:20,
      neck_cm:30,
      shoulder_cm:91.44,
      chest_cm:86.36,
      abdomen_cm:63.5,
      waist_cm:71.12, 
      hip_cm:91.44,
      r_bicep_cm:25.4,
      l_bicep_cm:25.4,
      r_thigh_cm:48.26,
      l_thigh_cm:48.26,
      r_calf_cm:33.02, 
      l_calf_cm:33.02,
      created_on:new Date('2024-05-01T00:00:00'),
      updated_on:new Date('2024-05-01T00:00:00')
    },

  ]);
};
