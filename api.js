// Import utilities
const morgan = require('morgan');
const express = require('express');
const mysql = require('mysql');
const request = require('request');
const { json } = require('express');

// Import student created functions
const dbF = require('./dbFunctions.js');

// Create app
var app = express();

// Middleware
app.set('view engine', 'ejs');

app
    .use(morgan('dev'))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))

// Connect to database (MUST USE LEGACY AUTHENTICATION METHOD (RETAIN MYSQL 5.X COMPATIBILITY))
const dbconnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'peciproj',
    database: 'PECI_PROJ',
    multipleStatements: true,
});

dbconnection.connect((error) => {

    if (error) {
        console.log("ERROR: Problems connecting to database!");
    }

    else {
        console.log("Connected to database successfully!");
    }

});

// Listen to requests
const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));


app.post('/createUser', (req, res) => {  
    // code 0 --> no errors, user inserted in the database
    // code 1 --> database error
    // code 2 --> unexpected error
    dbF.createUser(req.body.email, req.body.fname, req.body.lname, "chave")
    .then((data) => {
        console.log(data);
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

app.post('/createUser', (req, res) => {
    // code 0 --> no errors, return user data
    // code 1 --> database error
    // code 2 --> user does not exist
    dbF.selectUser(req.body.email, "chave")
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
            res.json({code:0, mail:u_mail, fname:u_fname, lname:u_lname});
        } 
    });
});