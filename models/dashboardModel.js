const knex = require('../db');

const { v4: uuidv4 } = require('uuid');


const getBodyCompositionByUserId = async (userId) => {
    try {
        const bodyComposition = await knex('body_composition_log')
            .select(
                "weight",
                "body_fat",
                "lean_muscle_mass",
                "bmi",
                knex.raw("EXTRACT(epoch FROM created_on)::int AS created_on"),
                // knex.raw("EXTRACT(epoch FROM updated_on)::int AS updated_on_unix")
            )
            .where({ user_id: userId })
            .orderBy('created_on','desc')
            .limit(2);

            const deltaBodyComp = {
                weight: bodyComposition[0].weight - bodyComposition[1].weight,
                bf: bodyComposition[0].body_fat - bodyComposition[1].body_fat,
                bmi: bodyComposition[0].bmi - bodyComposition[1].bmi,
                muscleMass: bodyComposition[0].lean_muscle_mass - bodyComposition[1].lean_muscle_mass,
            }

            const returnData = {
                body_composition:{
                    delta:{
                        delta_weight:{label:"Weight", "value":deltaBodyComp.weight.toFixed(2), uom:"lbs"},
                        delta_bf:{label:"BF%", "value":deltaBodyComp.bf.toFixed(2), uom:"%"},
                        delta_bmi:{label:"BMI", "value":deltaBodyComp.bmi.toFixed(2), uom:null},
                        delta_muscle_mass:{label:"Muscle Mass", value:deltaBodyComp.muscleMass.toFixed(2), uom:"lbs"}
                    },
                    params:{
                        current_weight:{label:"Weight", value:bodyComposition[0].weight, uom:"lbs"},
                        current_bf:{label:"BF%", value:bodyComposition[0].body_fat, uom:"%"},
                        current_bmi:{label:"BMI", value:bodyComposition[0].bmi, uom:null},
                        current_muscle_mass:{label:"Muscle Mass", value:bodyComposition[0].lean_muscle_mass, uom:"lbs"}
                    },
                    updated_on:bodyComposition[0].created_on,
                    last_updated_on:bodyComposition[1].created_on
                }
            }


            return returnData;
    } catch (err) {
        console.error('Error fetching body composition:', err);
        throw err;
    }
}





module.exports = {
    getBodyCompositionByUserId
};