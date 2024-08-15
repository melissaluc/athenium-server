/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('user_verification').del()
  await knex('user_verification').insert([
    {
      'user_id':'39b17fed-61d6-492a-b528-4507290d5423',
      'code':'156C2C',
      'email_address':'melissaluc94@gmail.com',
      'action':'verify_email',
      'created_on':new Date('2024-05-01T00:00:00'),
      'expires_at':new Date('2024-05-01T00:00:00'),
      'user_data':{}
    }
  ]);
};
