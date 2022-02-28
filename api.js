// Import utilities
const morgan = require('morgan');
const express = require('express');
const mysql = require('mysql');

// Import student created functions
const dotenv = require('dotenv').config();
const dbF = require('./dbFunctions.js');

// Create app
var app = express();

// Middleware
app
    .use(morgan('dev'))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))

// Listen to requests
const port = process.env.port || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));


//******************************************//
//             API Endpoints                //
//******************************************//

app.post('/createUser', (req, res) => {  
    // code 0 --> no errors, user inserted in the database
    // code 1 --> database error
    // code 2 --> unexpected error
    dbF.createUser(req.body.email, req.body.fname, req.body.lname, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) 
        }
        else if(data == 2){
            res.json({code:2}) 
        }
        else{
            res.json({code:0});
        } 
    });
});

app.post('/selectUser', (req, res) => {
    // code 0 --> no errors, return user data
    // code 1 --> database error
    // code 2 --> user does not exist or encrypt key is
    dbF.selectUser(req.body.email, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) 
        }
        else if(data == 2){
            res.json({code:2}) 
        }
        else{
            var u_mail = data[0][0]["mail"];
            var u_fname = data[0][0]["fName"];
            var u_lname = data[0][0]["lName"];
            res.json({code: 0, mail: u_mail, fname: u_fname, lname: u_lname});
        } 
    });
});
