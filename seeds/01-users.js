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
      username:"admin",
      email_address:"melissaluc94@gmail.com",
      google_id:"112079784067213194653",
      password:'mypassword',
      profile_img:'https://lh3.googleusercontent.com/a/ACg8ocJ_XwGAgemqy2Cz-6k-tKQoNOrNhaL7wBLcdiyytjlIuljEKStP=s96-c',
      dob:new Date('1995-05-01'),
      first_name:'Mary',
      last_name:'Sue',
      country:'Canada',
      height_cm:173,
      created_on:new Date('2024-05-01T00:00:00'),
      updated_on:new Date('2024-05-01T00:00:00')
    }
  ]);
};
