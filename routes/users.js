//  return logs for the given user

const express = require("express");
const router = express.Router();
const fs = require("fs");


const { error } = require("console");


const { v4: uuidv4 } = require('uuid');



// Routes:
// User: validate user log in


router.route("/user/:id")
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