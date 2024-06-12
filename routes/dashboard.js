//  return logs for the given user

const express = require("express");
const router = express.Router();
const fs = require("fs");
const measurementsLog = require("../controller/user/measurementsLog.js")
const userProfile = require("../controller/user/users.js")
const { error } = require("console");


const { v4: uuidv4 } = require('uuid');



// Routes:
// Dashboard: user profile data, user stats 
// Post/Put/Patch/Delete ProfileData
// Get DashboardData

router.route
    .get("/", async (req,res)=>{
        
        try {        
            const user_id = req.body.headers.user_id
            const measurements = await measurementsLog.getMeasurements(user_id)
            const profileData = await userProfile.getUserProfile(user_id)

            if (measurements.length === 0 || profileData.length ===0) {
                res.status(404).json({ error: 'User not found' });
            } else {

                const data = {
                    profile:profileData,
                    measurements: measurements,
                    }       
            
                    res.status(200).json(data)

                }   
            
            } catch (error) {
                console.log("Error: ",error)
                res.status(500).json({error: 'Internal server error'})
            }
    })

router.route("/").post(()=>{

    })
    .put(()=>{

    })
    .patch(()=>{

    })
    .delete(()=>{

    })



module.exports = router;