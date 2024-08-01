const knex = require('../utils/db');
const { v4: uuidv4 } = require('uuid');


const findUser = (filter) => {
    return knex('users')
        .select('user_id')
        .where(filter)
        .first()
}


const getUser = (userId) => {
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
                .where({'user_id': userId})
                .first()
                .then(userDetails => {
                    if (!userDetails) {
                        throw new Error(`User details not found for user_id '${user.user_id}'`);
                    }

                    // Fetch latest body composition data
                    return knex('body_composition_log')
                        .select('weight')
                        .where({ 'user_id': userId})
                        .orderBy('created_on', 'desc')
                        .limit(1)
                        .then(bodyComposition => {
                            // Fetch user's uom settings
                            return knex('user_uom')
                                .select('uom_name', 'abbreviation', 'uom')
                                .where({ 'user_id': userId})
                                .then(userSetUOM => {
                                    // Prep final user data object
                                    const uomObj = {}
                                    userSetUOM.map(uom => {
                                        uomObj[uom.uom_name] = {
                                            abbreviation: uom.abbreviation,
                                            uom: uom.uom
                                        }
                                    })
                                    const { user_id, ...userDetailsWithoutId } = userDetails;
                                    const userData = {
                                        ...userDetailsWithoutId,
                                        weight: bodyComposition.length > 0 ? bodyComposition[0].weight : null,
                                        uom: userSetUOM.length > 0 ? uomObj : null
                                    };

                                    return userData;
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
    // 1. User Table
    // 2. UOM Table

}


module.exports = {
    getUser,
    createUser,
    findUser

};