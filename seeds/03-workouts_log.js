/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('workouts_log').del();

  // Inserts seed entries
  await knex('workouts_log').insert([
    {
      uid: '00000000-0000-0000-0000-000000000001',
      user_id:"39b17fed-61d6-492a-b528-4507290d5423",
      last_completed: new Date(1715400000),
      created_on: new Date(1715400000),
      frequency: 10,
      workout_name: "Super Back",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis enim lobortis scelerisque fermentum dui faucibus in ornare quam.",
      tags: JSON.stringify(["Back Exercises", "Summer", "Cardio"])
    },
    {
      uid: '00000000-0000-0000-0000-000000000002',
      user_id:"39b17fed-61d6-492a-b528-4507290d5423",
      last_completed: new Date(1715313600),
      created_on: new Date(1715400000),
      frequency: 1,
      workout_name: "Marathon Training",
      description: "Gravida neque convallis a cras semper auctor neque vitae tempus. Vitae justo eget magna fermentum iaculis eu non diam. Porta nibh venenatis cras sed felis eget",
      tags: JSON.stringify(["Marathon", "Outdoor"])
    }
  ]);
};

