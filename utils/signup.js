const { createMeasurement } = require('../models/measurementModel');
const { createUser } = require('../models/userModel');
const { createBodyComposition } = require('../models/logModel');
const { addUOM } = require('../models/settingsModel');
const bcrypt = require('bcrypt');
const knex = require('../utils/db'); 

async function hashPassword(password) {
    let hashedPassword = null; 
    const saltRounds = 10;

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        console.log(`Salt: ${salt}`);
        hashedPassword = await bcrypt.hash(password, salt);
        console.log('Password hashed: ', hashedPassword);
    } catch (err) {
        console.error('Error hashing password:', err.message);
    }

    return hashedPassword; 
}

const addNewUser = async (userData) => {
    const {
        username,
        password,
        email_address,
        dob,
        first_name,
        last_name,
        country,
        google_id,
        current_body_weight,
        height_cm,
        bmr,
        bmi,
        ffmi,
        body_fat_percentage,
        lean_muscle_mass,
        uom,
        profile_img,
        newMeasurements,
        dateSelected
    } = userData;

    let hashedPassword = null;
    if (google_id === false) {
        hashedPassword = await hashPassword(password); // Await the result of hashPassword
    }
    console.log(' hashedPassword: ', hashedPassword, typeof hashedPassword)

    // Check if hashedPassword is null and throw an error
    if (google_id === false && hashedPassword === null) {
        throw new Error('Password hashing failed');
    }

    const user = { 
        username, 
        password: hashedPassword, // Use the hashed password
        email_address, 
        google_id, 
        profile_img, 
        dob, 
        first_name, 
        last_name, 
        country, 
        height_cm: Number(height_cm) 
    };

    console.log('UserData: ', user)

    try {
        const result = await knex.transaction(async (trx) => {
            // Insert user
            const userInsert = await createUser(user, trx);
            const userId = userInsert.user_id;
            console.log('create user id: ', userId);

            // Create measurements if provided
            if (newMeasurements && Object.keys(newMeasurements).length > 0) {
                console.log('Insert measurement');
                const insertMeasurement = await createMeasurement(userId, dateSelected, newMeasurements, trx);
                console.log('Insert measurement: ', insertMeasurement);
            }

            // Create body composition log
            const bodyComposition = {
                user_id: userId,
                weight: Number(current_body_weight),
                body_fat: Number(body_fat_percentage),
                lean_muscle_mass: Number(lean_muscle_mass),
                bmi: Number(bmi),
                bmr: Number(bmr),
                ffmi: Number(ffmi) || 0
            };
            await createBodyComposition(bodyComposition, trx);
            console.log('Inserted body composition');

            // Create UOM entries
            const userUOM = [
                {
                    user_id: userId,
                    uom_name: "body_mass",
                    abbreviation: "body weight",
                    uom: uom.body_mass,
                    description: "",
                },
                {
                    user_id: userId,
                    uom_name: "lift_weight",
                    abbreviation: "lift",
                    uom: uom.lift_weight,
                    description: "",
                },
                {
                    user_id: userId,
                    uom_name: "lean_muscle_mass",
                    abbreviation: "",
                    uom: uom.body_mass,
                    description: "",
                },
                {
                    user_id: userId,
                    uom_name: "height",
                    abbreviation: "",
                    uom: uom.height,
                    description: "",
                },
                {
                    user_id: userId,
                    uom_name: "girth_measurements",
                    abbreviation: "measurement",
                    uom: uom.girth_measurements,
                    description: "",
                }
            ];

            console.log('Inserting UOM entries:', userUOM);
            await addUOM(userUOM, trx);
            console.log('UOM entries inserted successfully');

            return { success: true }; // Return value from transaction
        });

        return result; // Return result from transaction
    } catch (error) {
        console.error('Error adding new user:', error);
        throw error; // Ensure error is thrown to be handled by calling code
    }
};

module.exports = { addNewUser };
