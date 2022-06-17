/* Import utilities */
const morgan = require('morgan');
const express = require('express');
const mysql = require('mysql');

/* Import student created functions and environment variables */
const dotenv = require('dotenv').config();
const dbF = require('./dbFunctions.js');

/* Create app */
var app = express();

/* Middleware */
app
    .use(morgan('dev'))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))

/* Listen to requests */
const port = process.env.port || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));


/*
*******************************************
             API ENDPOINTS                
*******************************************
*/
app.post('/selectClient', (req, res) => {
    dbF.selectClient(req.body.email, process.env.DB_ENCRYPTKEY).then((result) => {
        if(result == 1){
            res.json({code:1, msg: "Ocorreu um erro. Por favor tente mais tarde"}) /* code 1 --> Database error */
        }
        else if(result == 2){
            res.json({code:2}) /* code 2 --> User does not exist or encrypt key is incorrect */
        }
        else{
            var c_mail = result[0][0]["mail"];
            var c_fname = result[0][0]["firstName"];
            var c_lname = result[0][0]["lastName"];
            var c_birthdate = result[0][0]["birthDate"];
            var c_sex = result[0][0]["sex"];
            var c_street = result[0][0]["street"];
            var c_postCode = result[0][0]["postCode"];
            var c_city = result[0][0]["city"];
            var c_country = result[0][0]["country"];
            var c_registerDate = result[0][0]["registerDate"];
            var c_pathologies = result[0][0]["pathologies"];
            var c_imagePath = result[0][0]["imagePath"];
            res.json({code: 0, msg:"Uma conta já existe com este email", mailC: c_mail, firstNameC: c_fname, lastNameC: c_lname, birthdateC: c_birthdate, sexC: c_sex, streetC: c_street, postCodeC: c_postCode, cityC: c_city, countryC: c_country, registerDateC: c_registerDate, pathologiesC: c_pathologies, imagePathC: c_imagePath}); /* code 0 --> No errors, return user data */
        } 
    });
});

app.post('/createClient', (req, res) => {  
    const dataValues = (req.body.birthdate.split('/'));
    formattedBirthdate = dataValues[2]+"-"+dataValues[1]+"-"+dataValues[0];

    dbF.createClient(req.body.email, req.body.fname, req.body.lname, formattedBirthdate, req.body.sex, req.body.street, req.body.postCode, req.body.city, req.body.country, process.env.DB_ENCRYPTKEY).then((result) => {
        if(result == 1){
            res.json({msg:"Já existe uma conta com este email"}) // code 1 --> Email already exists
        }
        else if(result == 2){
            res.json({msg:"Ocorreu um erro. Por favor tente mais tarde"}) // code 2 --> Database error
        }
        else{
            res.json({code:0}); // code 0 --> No errors, insert was sucessful
        } 
    });
});

app.post('/deleteClient', (req, res) => {
    dbF.deleteClient(req.body.email, process.env.DB_ENCRYPTKEY).then((result) => {
        if(result == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(result == 2){
            res.json({code:2}) // code 2 --> User does not exist or encrypt key is incorrect
        }
        else{
            res.json({code: 0}); // code 0 --> No errors, delete was sucessful
        } 
    });
});

app.post('/addClientInfo', (req, res) => {
    dbF.addClientInfo(req.body.email, req.body.height, req.body.weight, req.body.fitness,  parseInt(req.body.bmi), req.body.pathologies, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:"O utilizador não existe!"}) // code 1 --> Database error
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
            var c_age = data[0][0]["age"];
            var c_height = data[0][0]["height"];
            var c_weight = data[0][0]["weight"];
            var c_fitness = data[0][0]["fitness"];
            var c_pathologies = data[0][0]["pathologies"];
            res.json({code: 0, age: c_age, height: c_height, weight: c_weight, fitness: c_fitness, pathologies: c_pathologies}); // code 0 --> No errors, return user data
        } 
    });
});

app.post('/finalizeClientPayment', (req, res) => {
    dbF.finalizeClientPayment(req.body.email, req.body.modality, req.body.amount, req.body.transID, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> User does not exist or encrypt key is incorrect
        }
        else{
            res.json({code:0}) // code 0 --> No errors, return user data
        } 
    });
});

app.post('/selectLatestClientPayment', (req, res) => {
    dbF.selectLatestClientPayment(req.body.email, process.env.DB_ENCRYPTKEY)
    .then((data) => {

        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2, paidDate: "", accountStatus: "free", plan: ""}) // code 2 --> User has not made any payment
        }
        else{
            var modality;
            if(data[0][0]["modality"] == "Monthly"){
                modality = "monthly";
            }
            else{
                modality = "yearly"
            }
            res.json({code:0, paidDate: data[0][0]["paymentDate"], accountStatus: "premium", plan: modality}) // code 0 --> No errors, return user data
        }
    });
});

app.post('/associateInstructor', (req, res) => {
    dbF.associateInstructor(req.body.clientEmail, req.body.instructorEmail, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> User does not exist or encrypt key is incorrect
        }
        else{
            res.json({code:0}) // code 0 --> No errors, return user data
        } 
    });
});

app.post('/isClientAssociated', (req, res) => {
    dbF.isClientAssociated(req.body.email, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2, isAssociated: "no", associatedDate: "", associatedInstructor: ""}) // code 2 --> No association or encrypt key is incorrect
        }
        else{
            res.json({code:0, isAssociated: "yes", associatedDate: data[0][0]["signedDate"], associatedInstructor: data[0][0]["mail"]})  // code 0 --> No errors, return user data
        } 
    });
});

app.post('/selectAssociatedInstructor', (req, res) => {
    dbF.selectAssociatedInstructor(req.body.email, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> No association or encrypt key is incorrect
        }
        else{
            res.json({code:0, data: data})  // code 0 --> No errors, return user data
        } 
    });
});

app.post('/clientReviewInstructor', (req, res) => {
    dbF.clientReviewInstructor(req.body.clientEmail, req.body.instructorEmail, req.body.rating, req.body.review, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> User does not exist or encrypt key is incorrect
        }
        else{
            res.json({code:0}) // code 0 --> No errors, return user data
        } 
    });
});

app.post('/selectClientPaymentHistory', (req, res) => {
    dbF.selectClientPaymentHistory(req.body.email, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> User does not exist or encrypt key is incorrect
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> Database error
        }
        else{
            res.json({code: 0, data: data}); // code 0 --> No errors, return user data
        } 
    });
});

app.post('/selectClientInstructorHistory', (req, res) => {
    dbF.selectClientInstructorHistory(req.body.email, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> User does not exist or encrypt key is incorrect
        }
        else{
            res.json({code: 0, data: data}); // code 0 --> No errors, return user data
        } 
    });
});

app.post('/addClientRewards', (req, res) => {
    dbF.addClientRewards(req.body.email, req.body.reward, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> User does not exist or encrypt key is incorrect
        }
        else{
            res.json({code:0}) // code 0 --> No errors, return user data
        } 
    });
});

app.post('/selectClientRewards', (req, res) => {
    dbF.selectClientRewards(req.body.email, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> User does not exist or encrypt key is incorrect
        }
        else{
            res.json({code: 0, data: data}); // code 0 --> No errors, return user data
        } 
    });
});

app.post('/selectClientPrograms', (req, res) => {
    dbF.selectClientPrograms(req.body.email, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> User does not exist or encrypt key is incorrect
        }
        else{
            res.json({code: 0, data: data}); // code 0 --> No errors, return user data
        } 
    });
});

app.post('/selectAvailableInstructors', (req, res) => {
    dbF.selectAvailableInstructors(process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> User does not exist or encrypt key is incorrect
        }
        else{
            res.json({code: 0, data: data}); // code 0 --> No errors, return user data
        } 
    });
});

app.post('/selectDefaultExercises', (req, res) => {
    dbF.selectDefaultExercises()
    .then((data) => {

        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> User does not exist or encrypt key is incorrect
        }
        else{
            res.json({code: 0, data: data}); // code 0 --> No errors, return user data
        } 
    });
});

app.post('/selectDefaultPrograms', (req, res) => {
    dbF.selectDefaultPrograms()
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> User does not exist or encrypt key is incorrect
        }
        else{
            res.json({code: 0, data: data}); // code 0 --> No errors, return user data
        } 
    });
});

app.post('/selectAllProgramExercises', (req, res) => {
    dbF.selectAllProgramExercises()
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> User does not exist or encrypt key is incorrect
        }
        else{
            res.json({code: 0, data: data}); // code 0 --> No errors, return user data
        } 
    });
});

app.post('/finishWorkout', (req, res) => {
    dbF.finishWorkout(req.body.email, req.body.progID, req.body.timeTaken, req.body.caloriesBurnt, req.body.heartRate, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> User does not exist or encrypt key is incorrect
        }
        else{
            res.json({code: 0}); // code 0 --> No errors, return user data
        } 
    });
});

app.post('/removeInstructorAssociation', (req, res) => {
    dbF.removeInstructorAssociation(req.body.email, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> User does not exist or encrypt key is incorrect
        }
        else{
            res.json({code:0, isAssociated: "no", associatedDate: "", associatedInstructor: ""}) // code 0 --> No errors
        } 
    });
});

app.post('/addUserImage', (req, res) => {
    dbF.addUserImage(req.body.email, req.body.imagePath, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> User does not exist or encrypt key is incorrect
        }
        else{
            res.json({code:0}) // code 0 --> No errors, return user data
        } 
    });
});

