const fs = require("fs");


const { v4: uuidv4 } = require('uuid');


async function getMeasurements(user_id) {
    try{
        const girthMeasurements = await knex.select(
            "uid",
            "user_id",
            "weight_kg",
            "musclemass_kg",
            "bf_percentage",
            "neck_cm",
            "shoulder_cm",
            "chest_cm",
            "abdomen_cm",
            "waist_cm", 
            "hip_cm",
            "r_bicep_cm",
            "l_bicep_cm",
            "r_thigh_cm",
            "l_thigh_cm",
            "r_calf_cm", 
            "l_calf_cm",
            "created_on",
            "updated_on"
        )
        .from("measurements_log")
        .where("user_id","=",user_id)
    
        return girthMeasurements
    } catch (error){
     throw error
    }

}




module.exports ={
    getMeasurements
}