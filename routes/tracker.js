//  return logs for the given user

const express = require("express");
const router = express.Router();
const fs = require("fs");


const { error } = require("console");


const { v4: uuidv4 } = require('uuid');



// Routes:
// Tracking: measurements, meals, workout, goalsls
// Post/Put/Patch/Delete Measurements
// Get Tracking




router.route("/")
    .get(()=>{

    })
    .post(()=>{

    })
    .put(()=>{

    })
    .patch(()=>{

    })
    .delete(()=>{

    })



module.exports = router;