const knex = require('../utils/db');

const { v4: uuidv4 } = require('uuid');


const getBodyCompositionByUserId = async (userId) => {
    try {
        const bodyComposition = await knex('body_composition_log')
            .select(
                "weight",
                "body_fat",
                "lean_muscle_mass",
                "bmi",
                "ffmi",
                "bmr",
                knex.raw("EXTRACT(epoch FROM created_on)::int AS created_on"),
                // knex.raw("EXTRACT(epoch FROM updated_on)::int AS updated_on_unix")
            )
            .where({ user_id: userId })
            .orderBy('created_on','desc')
            .limit(2);

        const userUom =await knex('user_uom')
            .where({ user_id: userId })
            .andWhere({ uom_name: 'body_mass' })

        if(bodyComposition.length) {
            const deltaBodyComp = {
                weight: bodyComposition[0].weight - bodyComposition[1].weight,
                bf: bodyComposition[0].body_fat - bodyComposition[1].body_fat,
                bmi: bodyComposition[0].bmi - bodyComposition[1].bmi,
                muscleMass: bodyComposition[0].lean_muscle_mass - bodyComposition[1].lean_muscle_mass,
                bmr:bodyComposition[0].bmr - bodyComposition[1].bmr,
                ffmi:bodyComposition[0].ffmi - bodyComposition[1].ffmi,
            }

            const returnData = {
                body_composition:{
                    delta:{
                        delta_weight:{label:"Weight", "value":deltaBodyComp.weight.toFixed(2), uom:userUom[0].uom},
                        delta_bf:{label:"BF%", "value":deltaBodyComp.bf.toFixed(2), uom:"%"},
                        delta_bmi:{label:"BMI", "value":deltaBodyComp.bmi.toFixed(2), uom:null},
                        delta_lean_body_mass:{label:"Lean Body Mass", value:deltaBodyComp.muscleMass.toFixed(2), uom:userUom[0].uom},
                        delta_bmr:{label:"BMR", value:deltaBodyComp.bmr.toFixed(2), uom:null},
                        delta_ffmi:{label:"Lean Body Mass", value:deltaBodyComp.ffmi.toFixed(2), uom:null},
                    },
                    params:{
                        current_weight:{label:"Weight", value:bodyComposition[0].weight, uom:userUom[0].uom},
                        current_bf:{label:"BF%", value:bodyComposition[0].body_fat, uom:"%"},
                        current_bmi:{label:"BMI", value:bodyComposition[0].bmi, uom:null},
                        current_lean_body_mass:{label:"Lean Body Mass", value:bodyComposition[0].lean_muscle_mass, uom:userUom[0].uom},
                        current_bmr:{label:"BMR", value:bodyComposition[0].bmr, uom:null},
                        current_ffmi:{label:"FFMI", value:bodyComposition[0].ffmi, uom:null}
                    },
                    updated_on:bodyComposition[0].created_on,
                    last_updated_on:bodyComposition[1].created_on
                }
            }

            return returnData;
        }

    } catch (err) {
        console.error('Error fetching body composition:', err);
        throw err;
    }
}





module.exports = {
    getBodyCompositionByUserId
};