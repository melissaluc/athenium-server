// models/measurementModel.js
const config = require("../knexfile.js");
const { error, timeStamp } = require("console");
const knex = require("knex")(config.development);

const { v4: uuidv4 } = require('uuid');

const getUser = async (userId) => {
    try {
        const user= await knex('users')
            .select(
                "user_id",
                "username",
                knex.raw("DATE_PART('year', AGE(dob))::int as age"),
                "first_name",
                "last_name",
                "height"
            )
            .where({ 'user_id': userId })
            .first()

        const bodyComposition = await knex('body_composition_log')
        .select(
            "weight"
        )
        .where({ user_id: userId })
        .orderBy('created_on','desc')
        .limit(1);

        const userData = {
            ...user,
            weight: bodyComposition[0] ? bodyComposition[0].weight : null
        }

        return userData;
            
    } catch (err) {
        console.error('Error fetching user:', err);
        throw err;
    }
}



module.exports = {
    getUser,

};