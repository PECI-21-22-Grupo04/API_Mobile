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


/*
*******************************************
             API ENDPOINTS                
*******************************************
*/

app.post('/createClient', (req, res) => {  
    dbF.createClient(req.body.email, req.body.fname, req.body.lname, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:"Já existe uma conta com este email"}) // code 1 --> Email already exists
        }
        else if(data == 2){
            res.json({code:"Ocorreu um erro. Por favor tente mais tarde"}) // code 2 --> Database error
        }
        else{
            res.json({code:0}); // code 0 --> No errors, insert was sucessful
        } 
    });
});


app.post('/selectClient', (req, res) => {
    dbF.selectClient(req.body.email, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> User does not exist or encrypt key is incorrect 
        }
        else{
            var u_mail = data[0][0]["mail"];
            var u_fname = data[0][0]["fName"];
            var u_lname = data[0][0]["lName"];
            res.json({code: 0, mail: u_mail, fname: u_fname, lname: u_lname}); // code 0 --> No errors, return user data
        } 
    });
});


app.post('/deleteClient', (req, res) => {
    dbF.deleteClient(req.body.email, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> User does not exist or encrypt key is incorrect
        }
        else{
            res.json({code: 0}); // code 0 --> No errors, delete was sucessful
        } 
    });
});


app.post('/addClientInfo', (req, res) => {
    dbF.addClientInfo(req.body.email, req.body.age, req.body.height, req.body.weight, req.body.fitness, req.body.pathologies, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:"Ocorreu um erro. Por favor tente mais tarde"}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:"Ocorreu um erro. Por favor tente mais tarde"}) // code 2 --> User does not exist or encrypt key is incorrect
        }
        else{
            res.json({code: 0}); // code 0 --> No errors, user info was added sucessfully
        } 
    });
});


app.post('/selectClientInfo', (req, res) => {
    dbF.selectClientInfo(req.body.email, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> User does not exist or encrypt key is incorrect
        }
        else{
            var u_age = data[0][0]["age"];
            var u_height = data[0][0]["height"];
            var u_weight = data[0][0]["weight"];
            var u_fitness = data[0][0]["fitness"];
            var u_pathologies = data[0][0]["pathologies"];
            res.json({code: 0, age: u_age, height: u_height, weight: u_weight, fitness: u_fitness, pathologies: u_pathologies}); // code 0 --> No errors, return user data
        } 
    });
});