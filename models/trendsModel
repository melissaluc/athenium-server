// models/measurementModel.js
const config = require("../knexfile.js");
const { error } = require("console");
const knex = require("knex")(config.development);

const { v4: uuidv4 } = require('uuid');
const { options } = require("../routes/trends.js");

const getTrendsByUserId = async (userId) => {
    try {
        const measurements = await knex('measurements_log')
            .select(
                'neck_cm AS neck',
                'shoulder_cm AS shoulder',
                'chest_cm AS chest',
                'abdomen_cm AS abdomen',
                'waist_cm AS waist',
                'hip_cm AS hip',
                'r_bicep_cm AS rbicep',
                'l_bicep_cm AS lbicep',
                'r_upper_thigh_cm AS rupperthigh',
                'l_upper_thigh_cm AS lupperthigh',
                'r_thigh_cm AS rthigh',
                'l_thigh_cm AS lthigh',
                'r_calf_cm AS rcalf',
                'l_calf_cm AS lcalf',
                knex.raw("EXTRACT(epoch FROM created_on)::int AS timestamp"),
                // knex.raw("EXTRACT(epoch FROM updated_on)::int AS updated_on_unix")
            )
            .where({ user_id: userId });

        const bodyComposition = await knex('body_composition_log')
            .select(
                "weight",
                "body_fat",
                "lean_muscle_mass",
                "bmi",
                knex.raw("EXTRACT(epoch FROM created_on)::int AS timestamp"),
                // knex.raw("EXTRACT(epoch FROM updated_on)::int AS updated_on_unix")
            )
            .where({ user_id: userId });

            if (bodyComposition.length > 1) {
                // Calculate differences between measurements
                for (let i = 1; i < bodyComposition.length; i++) {
                    bodyComposition[i].weight_diff = bodyComposition[i].weight - bodyComposition[i - 1].weight;
                    bodyComposition[i].body_fat_diff = bodyComposition[i].body_fat - bodyComposition[i - 1].body_fat;
                    bodyComposition[i].lean_muscle_mass_diff = bodyComposition[i].lean_muscle_mass - bodyComposition[i - 1].lean_muscle_mass;
                    bodyComposition[i].bmi_diff = bodyComposition[i].bmi - bodyComposition[i - 1].bmi;
                }
            }

            
            const nutrition = await knex('meals_log')
            .select(
              knex.raw('SUM(protein) as protein'),
              knex.raw('SUM(carbs) as carbs'),
              knex.raw('SUM(fat) as fat'),
              knex.raw('SUM(calories) as calories'),
              knex.raw("EXTRACT(epoch FROM planned_on)::int AS timestamp")
            )
            .where({ user_id: userId })
            .groupBy('planned_on')
            .orderBy('planned_on');
            
            
            const strength = await knex('strength_log')
            .select(
                'exercise_name',
                'group',
                'one_rep_max',
                'lift',
                knex.raw('lift * COALESCE(reps, 1) AS product_lift_reps'),
                knex.raw('lift / body_weight AS relative_strength'),
                knex.raw("EXTRACT(epoch FROM calculated_on)::int AS timestamp")
            )
            .where({ user_id: userId })
            .orderBy('group', 'asc')
            .orderBy('exercise_name', 'asc')
            .orderBy('timestamp', 'asc');
        
        
        
            const strengthTransformed = {}
            const strengthOptions = {}
            strength.forEach(exercise => {
                const { group, exercise_name, timestamp, lift, reps, sets, product_lift_reps, relative_strength, strength_level, one_rep_max } = exercise;
            
                if (!strengthTransformed[group]) {
                    strengthTransformed[group] = {};
                }
                
                if (!strengthTransformed[group][exercise_name]) {
                    strengthTransformed[group][exercise_name] = [];
                }
            
                if (!strengthOptions[group]) {
                    strengthOptions[group] = [];
                }
            
                if (!strengthOptions[group].includes(exercise_name)) {
                    strengthOptions[group].push(exercise_name);
                }
            
                strengthTransformed[group][exercise_name].push({
                    timestamp,
                    lift,
                    reps,
                    sets,
                    work_volume: product_lift_reps,
                    relative_strength,
                    strength_level,
                    one_rep_max
                });
            });

        const trends = {
            body_composition:{
                uom:{
                    "weight":"lbs",
                    "body_fat":"%",
                    "lean_muscle_mass":"lbs",
                    "bmi":"kg/m**2"
        
                },
                options:["weight", "body_fat", "lean_muscle_mass", "bmi","weight_diff","body_fat_diff","lean_muscle_mass_diff","bmi_diff"],
                data:bodyComposition
            },
            measurements:{
                uom: "inch",
                options:[
                            "neck",
                            "chest",
                            "shoulder",
                            "rbicep",
                            "lbicep",
                            "waist",
                            "abdomen",
                            "hip",
                            "rupperthigh",
                            "lupperthigh",
                            "rthigh",
                            "lthigh",
                            "rcalf",
                            "lcalf"
                        ],
                data:measurements
            },
            nutrition:{
                "uom": {
                    "macros": "g",
                    "calories": "cal"
                },
                "options":[
                    "protein",
                    "carbs",
                    "fat",
                    "calories"
                ],
                data:nutrition
            },
            strength:{
                uom:{
                    lift: "lbs",
                    one_rep_max: "lbs"
                },
                options:strengthOptions,
                data:strengthTransformed
            }

        }

        return trends;
    } catch (err) {
        console.error('Error fetching trends:', err);
        throw err;
    }
}


module.exports = {
    getTrendsByUserId
};