//  return logs for the given user

const express = require("express");
const router = express.Router();
const getExercises = require("../controller/getExercises.js")
const { authenticateToken } = require('../utils/auth');



// Routes:
// Get Exercises

router.route("/")
    .get(authenticateToken ,(req, res)=>{

        try {
            getExercises(req.body.headers.user_id)
            .then((exercises)=>{
                if (exercises.length === 0) {
                    res.status(404).json({ error: 'Exercises not retrieved' });
                } else {
                    res.status(200).json(exercises);
                }
            })
            .catch((error)=>{
                res.status(500).json({error:{message:"Internal server error"}})
            })


        } catch (error) {
            res.status(500).json({error: "Internal server error"})
        }

    })


module.exports = router;