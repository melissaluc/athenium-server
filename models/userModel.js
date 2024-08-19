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
            knex.raw(`
                CAST(
                FLOOR(
                    EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM dob) -
                    CASE
                        WHEN EXTRACT(MONTH FROM CURRENT_DATE) < EXTRACT(MONTH FROM dob)
                            OR (EXTRACT(MONTH FROM CURRENT_DATE) = EXTRACT(MONTH FROM dob) 
                                AND EXTRACT(DAY FROM CURRENT_DATE) < EXTRACT(DAY FROM dob))
                        THEN 1
                        ELSE 0
                    END
                ) AS INT
            ) AS age`
            ),
            "first_name",
            "last_name",
            "height_cm"
        )
        .where({'user_id': userId})
        .first()
        .then(userDetails => {
            if (!userDetails) {
                throw new Error(`User details not found for user_id '${userId}'`);
            }

            return knex('body_composition_log')
                .select('weight')
                .where({ 'user_id': userId})
                .orderBy('created_on', 'desc')
                .limit(1)
                .then(bodyComposition => {
                    return knex('user_uom')
                        .select('uom_name', 'abbreviation', 'uom')
                        .where({ 'user_id': userId})
                        .then(userSetUOM => {
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


const createUser = async (user) => {
    const id = uuidv4();
    const {username, hashedPassword, email_address, google_id, profile_img, dob, first_name, last_name, country, height_cm} = user
    const date = new Date(dob);
    date.setUTCHours(0, 0, 0, 0);
    try {
        const [newUser] = await knex('users')
        .insert({
            user_id: id,
            username,
            password: hashedPassword,
            email_address,
            google_id,
            profile_img,
            dob:date.toISOString(),
            first_name,
            last_name,
            country,
            height_cm,
            created_on: new Date().toISOString(),
            updated_on: new Date().toISOString()
        })
        .returning('*');
        console.log('newUser: ',newUser)
        return newUser;
    

    } catch (error) {
        console.error('Error creating user:', error);
        throw error; 
    }

}   

const updateUser = async (userId, newUserData) => {
    try {
        await knex('users')
        .where({ 'user_id': userId })
        .update(newUserData);

        console.log(`User with ID ${userId} has been updated.`);

    } catch (error) {
        console.error('Error updating user:', error);
    }

}


module.exports = {
    getUser,
    createUser,
    findUser,
    updateUser

};