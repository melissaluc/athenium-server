/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('measurements_log').del();
  await knex('measurements_log').insert([
    {
      uid: "4454438f-263e-4132-abb5-d9ab74700e68",
      user_id: "39b17fed-61d6-492a-b528-4507290d5423",
      neck_cm: 30,
      shoulder_cm: 91.44,
      chest_cm: 86.36,
      abdomen_cm: 63.5,
      waist_cm: 71.12,
      hip_cm: 91.44,
      r_bicep_cm: 25.4,
      l_bicep_cm: 25.4,
      r_thigh_cm: 48.26,
      l_thigh_cm: 48.26,
      r_calf_cm: 33.02,
      l_calf_cm: 33.02,
      created_on: new Date('2024-05-01T00:00:00'),
      updated_on: new Date('2024-05-01T00:00:00')
    },
    {
      uid: "5565438f-263e-4132-abb5-d9ab74700e68",
      user_id: "39b17fed-61d6-492a-b528-4507290d5423",
      neck_cm: 31,
      shoulder_cm: 92.0,
      chest_cm: 87.0,
      abdomen_cm: 64.0,
      waist_cm: 72.0,
      hip_cm: 92.0,
      r_bicep_cm: 26.0,
      l_bicep_cm: 26.0,
      r_thigh_cm: 49.0,
      l_thigh_cm: 49.0,
      r_calf_cm: 34.0,
      l_calf_cm: 34.0,
      created_on: new Date('2024-05-10T00:00:00'),
      updated_on: new Date('2024-05-10T00:00:00')
    },
    {
      uid: "6676438f-263e-4132-abb5-d9ab74700e68",
      user_id: "39b17fed-61d6-492a-b528-4507290d5423",
      neck_cm: 32,
      shoulder_cm: 93.0,
      chest_cm: 88.0,
      abdomen_cm: 65.0,
      waist_cm: 73.0,
      hip_cm: 93.0,
      r_bicep_cm: 27.0,
      l_bicep_cm: 27.0,
      r_thigh_cm: 50.0,
      l_thigh_cm: 50.0,
      r_calf_cm: 35.0,
      l_calf_cm: 35.0,
      created_on: new Date('2024-05-20T00:00:00'),
      updated_on: new Date('2024-05-20T00:00:00')
    }
  ]);
};
