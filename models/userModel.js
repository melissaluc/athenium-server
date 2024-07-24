const knex = require('../db');
const { v4: uuidv4 } = require('uuid');

const getUser = (username) => {
    return knex('users')
        .select('user_id')
        .where({ 'username': username })
        .first()
        .then(user => {
            if (!user) {
                throw new Error(`User with username '${username}' not found`);
            }

            // Fetch user details
            return knex('users')
                .select(
                    "user_id",
                    "username",
                    knex.raw("DATE_PART('year', AGE(dob))::int as age"),
                    "first_name",
                    "last_name",
                    "height_cm"
                )
                .where({ 'user_id': user.user_id })
                .first()
                .then(userDetails => {
                    if (!userDetails) {
                        throw new Error(`User details not found for user_id '${user.user_id}'`);
                    }

                    // Fetch latest body composition data
                    return knex('body_composition_log')
                        .select('weight')
                        .where({ 'user_id': user.user_id })
                        .orderBy('created_on', 'desc')
                        .limit(1)
                        .then(bodyComposition => {
                            // Fetch user's uom settings
                            return knex('user_uom')
                                .select('uom_name', 'abbreviation', 'uom')
                                .where({ 'user_id': user.user_id })
                                .then(userSetUOM => {
                                    // Prep final user data object
                                    const uomObj = {}
                                    userSetUOM.map(uom => {
                                        uomObj[uom.uom_name] = {
                                            abbreviation: uom.abbreviation,
                                            uom: uom.uom
                                        }
                                    })

                                    const userData = {
                                        ...userDetails,
                                        weight: bodyComposition.length > 0 ? bodyComposition[0].weight : null,
                                        uom: userSetUOM.length > 0 ? uomObj : null
                                    };

                                    return userData;
                                });
                        });
                });
        })
        .catch(err => {
            console.error('Error fetching user:', err);
            throw err;
        });
}

const createUser = () => {
    // Retrieve sign up data
    // Generate UOM settings
    // User: height
    // Body Composition: body_weight, BMI, lean_muscle_mass 
    // Measurements: girth_measurements
    // Workouts: lift_weight

}


module.exports = {
    getUser,

};