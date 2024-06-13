const fs = require("fs");

const config = require("../../knexfile.js");
const { error } = require("console");
const knex = require("knex")(config);

const { v4: uuidv4 } = require('uuid');


async function getUserProfile(user_id) {
    try{
        const userProfile = await knex.select(
            "user_id",
            "username",
            "email_address",
            "password",
            "dob",
            "google_id",
            "first_name",
            "last_name",
            "weight_units",
            "length_units",
            "height_cm",
            "leg_cm",
            "torso_cm",
            "country",
            "created_on",
            "updated_on",
        )
        .from("users")
        .where("user_id","=",user_id)
    
        return userProfile
    } catch (error){
     throw error
    }
}

module.exports = {
    getUserProfile
}