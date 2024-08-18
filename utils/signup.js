const {createMeasurement} = require('../models/measurementModel');
const {createUser} = require('../models/userModel')
const {createBodyComposition} = require('../models/logModel')
const {addUOM} = require('../models/settingsModel')
const bcrypt = require('bcrypt');

const addNewUser = async (userData) => {
    const { username, password, email_address, dob, first_name, last_name, country, google_id, current_body_weight, height_cm, bmr, bmi, ffmi, body_fat_percentage, lean_muscle_mass, uom, profile_img } = userData;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = { username, hashedPassword, email_address, google_id, profile_img, dob, first_name, last_name, country, height_cm };
    
    try {
        // Insert user
        const userInsert = await createUser(user);
        const userId = userInsert.user_id;
        console.log('create user id: ',userId)

        // Create measurements if provided
        if (userData.newMeasurements && Object.keys(userData.newMeasurements).length > 0) {
            console.log('Insert measurement')
            const insertMeasurement = await createMeasurement(userId, userData.dateSelected, userData.newMeasurements);
            console.log('Insert measurement: ',insertMeasurement)
        }

        // Create body composition log
        const bodyComposition = {
            user_id: userId,
            weight: current_body_weight,
            body_fat: body_fat_percentage,
            lean_muscle_mass: lean_muscle_mass,
            bmi: bmi,
            bmr: bmr,
            ffmi: ffmi || 0
        };
        await createBodyComposition(bodyComposition);
        console.log('Inserted body composition')
        // Create UOM entries
        const userUOM = [
            {
                user_id: userId,
                uom_name: "body_mass",
                abbreviation: "body weight",
                uom: uom.body_mass,
                description: "",
                updated_on: new Date().toISOString(),
                created_on: new Date().toISOString()
            },
            {
                user_id: userId,
                uom_name: "lift_weight",
                abbreviation: "lift",
                uom: uom.lift_weight,
                description: "",
                updated_on: new Date().toISOString(),
                created_on: new Date().toISOString()
            },
            {
                user_id: userId,
                uom_name: "lean_muscle_mass",
                abbreviation: "",
                uom: uom.body_mass,
                description: "",
                updated_on: new Date().toISOString(),
                created_on: new Date().toISOString()
            },
            {
                user_id: userId,
                uom_name: "height",
                abbreviation: "",
                uom: uom.height,
                description: "",
                updated_on: new Date().toISOString(),
                created_on: new Date().toISOString()
            },
            {
                user_id: userId,
                uom_name: "girth_measurements",
                abbreviation: "measurement",
                uom: uom.girth_measurements,
                description: "",
                updated_on: new Date().toISOString(),
                created_on: new Date().toISOString()
            }
        ];

        await addUOM(userUOM);

        return { success: true };
    } catch (error) {
        console.error('Error adding new user:', error);
        throw error;
    }
};


module.exports = {addNewUser};