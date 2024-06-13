//  return logs for the given user

const express = require("express");
const router = express.Router();
const fs = require("fs");
const calculateStrength = require("../controller/calculateStrength.js");

const config = require("../knexfile.js");
const { error } = require("console");
const knex = require("knex")(config);

const { v4: uuidv4 } = require('uuid');



// Routes:
// Strength Level
// Get StrengthLevel
// Post/Put/Patch/Delete StrengthLevel


router.route("/")
    .post((req, res)=>{
        const {ageYears, gender, bodyMass, liftMass, reps, exerciseName} = req.body;


        calculateStrength(ageYears, gender, bodyMass, liftMass, reps, exerciseName)
        .then((result)=>{
            if (result.length === 0) {
                res.status(404).json({ error: 'Strength Level cannot be calculated' });
            } else {
                res.status(200).json(result);
            }
        })
        .catch((error)=>{
            res.status(500).json({error:{message:"Internal server error"}})
        })

    })
    .put(()=>{

    })
    .patch(()=>{

    })
    .delete(()=>{

    })



module.exports = router;
