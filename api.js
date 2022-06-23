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
app.listen(process.env.PORT || 8080);


/*
*******************************************
             API ENDPOINTS                
*******************************************
*/
app.post('/selectClient', (req, res) => {
    dbF.selectClient(req.body.email, process.env.DB_ENCRYPTKEY).then((result) => {
        if(result == 1){
            res.json({code:1, msg: "Ocorreu um erro. Por favor tente mais tarde"}) // code 1 --> Database error 
        }
        else if(result == 2){
            res.json({code:2}) // code 2 --> Client does not exist or encrypt key is incorrect 
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
            res.json({code: 0, msg:"Uma conta já existe com este email", mailC: c_mail, firstNameC: c_fname, lastNameC: c_lname, birthdateC: c_birthdate, sexC: c_sex, streetC: c_street, postCodeC: c_postCode, cityC: c_city, countryC: c_country, registerDateC: c_registerDate, pathologiesC: c_pathologies, imagePathC: c_imagePath}); // code 0 --> Return client data
        } 
    });
});

app.post('/createClient', (req, res) => {  
    const dataValues = (req.body.birthdate.split('/'));
    formattedBirthdate = dataValues[2]+"-"+dataValues[1]+"-"+dataValues[0];

    dbF.createClient(req.body.email, req.body.fname, req.body.lname, formattedBirthdate, req.body.sex, req.body.street, req.body.postCode, req.body.city, req.body.country, process.env.DB_ENCRYPTKEY).then((result) => {
        if(result == 1){
            res.json({msg:"Já existe uma conta com este email"}) // code 1 --> Client with the provided email already exists
        }
        else if(result == 2){
            res.json({msg:"Ocorreu um erro. Por favor tente mais tarde"}) // code 2 --> Database error
        }
        else{
            res.json({code:0}); // code 0 --> Client was successfully created
        } 
    });
});

app.post('/deleteClient', (req, res) => {
    dbF.deleteClient(req.body.email, process.env.DB_ENCRYPTKEY).then((result) => {
        if(result == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(result == 2){
            res.json({code:2}) // code 2 --> Client does not exist or encrypt key is incorrect
        }
        else{
            res.json({code: 0}); // code 0 --> Client was successfully deleted
        } 
    });
});

app.post('/addClientInfo', (req, res) => {
    dbF.addClientInfo(req.body.email, req.body.height, req.body.weight, req.body.fitness,  parseInt(req.body.bmi), req.body.pathologies, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:"O utilizador não existe!"}) // code 1 --> Client does not exist or encrypt key is incorrect
        }
        else if(data == 2){
            res.json({code:"Ocorreu um erro. Por favor tente mais tarde"}) // code 2 --> Database error
        }
        else{
            res.json({code: 0}); // code 0 --> Information was successfully added
        } 
    });
});

app.post('/updateClient', (req, res) => {  
    const dataValues = (req.body.birthdate.split('/'));
    formattedBirthdate = dataValues[2]+"-"+dataValues[1]+"-"+dataValues[0];

    dbF.updateClient(req.body.email, req.body.fname, req.body.lname, formattedBirthdate, req.body.sex, req.body.street, req.body.postCode, req.body.city, req.body.country, process.env.DB_ENCRYPTKEY).then((result) => {

        if(result == 1){
            res.json({code: 1})  // code 1 --> Database error
        }
        else if(result == 2){
            res.json({code: 2}) // code 2 --> Client does not exist or encrypt key is incorrect
        }
        else{
            res.json({code:0}); // code 0 --> Client was successfully updated
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
            res.json({code:2}) // code 2 --> Client does not exist or encrypt key is incorrect
        }
        else{
            res.json({code: 0, data: data}); // code 0 --> Return requested data
        } 
    });
});

app.post('/finalizeClientPayment', (req, res) => {
    dbF.finalizeClientPayment(req.body.email, req.body.modality, req.body.amount, req.body.transID, req.body.doneDate, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> Client does not exist or encrypt key is incorrect
        }
        else{
            res.json({code:0}) // code 0 --> Payment was successfully saved
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
            res.json({code:2, paidDate: "", accountStatus: "free", plan: ""}) // code 2 --> Client hasnt made any payments
        }
        else{
            var modality;
            if(data[0][0]["modality"] == "Monthly"){
                modality = "monthly";
            }
            else{
                modality = "yearly"
            }
            res.json({code:0, paidDate: data[0][0]["paymentDate"], accountStatus: "premium", plan: modality}) // code 0 --> Client has made payments, return information about the latest one
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
            res.json({code:2}) // code 2 --> Client/Instructor does not exist or encrypt key is incorrect
        }
        else{
            res.json({code:0}) // code 0 --> Client has been successfully associated to an instructor
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
            res.json({code:2, isAssociated: "no", associatedDate: "", associatedInstructor: ""}) // code 2 --> Client has never been associated
        }
        else{
            res.json({code:0, isAssociated: "yes", associatedDate: data[0][0]["signedDate"], associatedInstructor: data[0][0]["mail"]})  // code 0 --> Client is/has been associated, return information about latest one
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
            res.json({code:2}) // code 2 --> Client is not associated
        }
        else{
            res.json({code:0, data: data})  // code 0 --> Client is associated, return information about the instructor
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
            res.json({code:2}) // code 2 --> Client/Instructor does not exist or encrypt key is incorrect
        }
        else{
            res.json({code:0}) // code 0 --> Review was successfully saved
        } 
    });
});

app.post('/selectClientPaymentHistory', (req, res) => {
    dbF.selectClientPaymentHistory(req.body.email, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> Client does not exist or encrypt key is incorrect
        }
        else{
            res.json({code: 0, data: data}); // code 0 --> Return client payment history
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
            res.json({code:2}) // code 2 --> Client does not exist or encrypt key is incorrect
        }
        else{
            res.json({code: 0, data: data}); // code 0 --> Return client instructor history
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
            res.json({code:2}) // code 2 --> Client does not exist or encrypt key is incorrect
        }
        else{
            res.json({code:0}) // code 0 --> Reward has been given to client
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
            res.json({code:2}) // code 2 --> Client has no rewards
        }
        else{
            res.json({code: 0, data: data}); // code 0 --> Return client rewards
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
            res.json({code:2}) // code 2 --> Client has no private program associated 
        }
        else{
            res.json({code: 0, data: data}); // code 0 --> Return clients private programs
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
            res.json({code:2}) // code 2 --> There are no available instructors
        }
        else{
            res.json({code: 0, data: data}); // code 0 --> Return available instructors
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
            res.json({code:2}) // code 2 --> There are no available free exercises
        }
        else{
            res.json({code: 0, data: data}); // code 0 --> Return free exercises
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
            res.json({code:2}) // code 2 --> There are no available free programs
        }
        else{
            res.json({code: 0, data: data}); // code 0 --> Return free programs
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
            res.json({code:2}) // code 2 --> There are no exercises associated to programs
        }
        else{
            res.json({code: 0, data: data}); // code 0 --> Return program-exercise association
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
            res.json({code:2}) // code 2 --> Client does not exist or encrypt key is incorrect
        }
        else{
            res.json({code: 0}); // code 0 --> Information about workout was saved
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
            res.json({code:2}) // code 2 --> Client/Instructor does not exist or encrypt key is incorrect
        }
        else{
            res.json({code:0, isAssociated: "no", associatedDate: "", associatedInstructor: ""}) // code 0 --> Association between client-instructor was removed
        } 
    });
});

app.post('/selectClientWorkoutHistory', (req, res) => {
    dbF.selectClientWorkoutHistory(req.body.email, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> Client does not have any workouts done
        }
        else{
            res.json({code:0, data: data}) // code 0 --> Return client workout history
        } 
    });
});

app.post('/updateFirebaseID', (req, res) => {
    dbF.updateFirebaseID(req.body.email, req.body.firebaseID, process.env.DB_ENCRYPTKEY)
    .then((data) => {
        if(data == 1){
            res.json({code:1}) // code 1 --> Database error
        }
        else if(data == 2){
            res.json({code:2}) // code 2 --> Client does not exist or encrypt key is incorrect
        }
        else{
            res.json({code:0, data: data}) // code 0 --> Clients firebaseID has been updated
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
            res.json({code:2}) // code 2 --> Client does not exist or encrypt key is incorrect
        }
        else{
            res.json({code:0}) // code 0 --> Clients image path has been saved
        } 
    });
});

//The 404 Route 
app.get('*', function(req, res){
    res.status(404).send('RUNX: This action cannot be done.');
  });