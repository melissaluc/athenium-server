/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      user_id:"39b17fed-61d6-492a-b528-4507290d5423",
      username:"user",
      email_address:"atheniumTesterUser@gmail.com",
      password:'mypassword',
      dob:new Date('1995-05-01'),
      first_name:'Mary',
      last_name:'Sue',
      weight_units:'imperial',
      length_units:'imperial',
      height_cm:'171',
      leg_cm:76,
      torso_cm:95,
      country:'Canada',
      created_on:new Date('2024-05-01T00:00:00'),
      updated_on:new Date('2024-05-01T00:00:00')
    }
  ]);
};
