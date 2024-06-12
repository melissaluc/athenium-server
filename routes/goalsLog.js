//  return logs for the given user

const express = require("express");
const router = express.Router();
const fs = require("fs");
const goalsLog = require("../controller/user/goalsLog.js")

const { error } = require("console");

const { v4: uuidv4 } = require('uuid');



// Routes:
// Logs:goals
// Get Goals
// Post/Put/Patch/Delete Goals



router.route("/")
    .get((req,res)=>{
        goalsLog.queryUserGoalsLog(req.body.headers.user_id)
        .then((rows)=>{
            if (rows.length === 0) {
                res.status(404).json({ error: 'User not found' });
            } else {
                res.status(200).json(rows);
            }
        })
        .catch((error)=>{
            res.status(500).json({error:{message:"Internal server error"}})
        })
    })
    .post((req,res)=>{

    })
    .put((req,res)=>{

    })
    .patch((req,res)=>{

    })
    .delete((req,res)=>{

    })




module.exports = router;