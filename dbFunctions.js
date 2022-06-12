/* Import utilities */
const mysql = require('mysql');
const dotenv = require('dotenv').config();

module.exports = {
    selectClient,
    createClient,
    deleteClient,
    addClientInfo,
    selectClientInfo,
    finalizeClientPayment,
    selectLatestClientPayment,
    associateInstructor,
    isClientAssociated,
    selectAssociatedInstructor,
    clientReviewInstructor,
    selectClientPaymentHistory,
    selectClientInstructorHistory,
    addClientRewards,
    selectClientRewards,
    selectClientPrograms,
    selectAvailableInstructors,
    selectDefaultExercises,
    selectDefaultPrograms,
    addUserImage
}

const dbconnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

dbconnection.connect((error) => {
    if (error) {
        console.log("ERROR: Problems connecting to database!");
    }
});


/*
*******************************************
            STORED PROCEDURES               
*******************************************
*/
function selectClient(mail, userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL spSelectClient(?,?)';

        dbconnection.query(sql, [mail, userKey], (err, data) => {
            
            if (err) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data.length > 0 && data[0].length > 0) {
                resolve(data);
            }
            else {
                resolve(2);
            }
        });
    });
};

function createClient(mail, fName, lName, birthdate, sex, street, postCode, city, country, userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL spCreateClient(?,?,?,?,?,?,?,?,?,?)';

        dbconnection.query(sql, [mail, fName, lName, birthdate, sex, street, postCode, city, country, userKey], (err, data) => {
            if (err && err.errno==1062) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data["affectedRows"] == 0) { 
                resolve(0);
            }
            else {
                resolve(2);
            }
        });
    });
};

function deleteClient(mail, userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL spDeleteClient(?,?)';

        dbconnection.query(sql, [mail, userKey], (err, data) => {
            if (err) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data["affectedRows"] == 0) {
                resolve(0);
            }
            else {
                resolve(2);
            }
        });
    });
};

function addClientInfo(mail, height, weight, fitness, bmi, pathologies, userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL spAddClientInfo(?,?,?,?,?,?,?)';
        dbconnection.query(sql, [mail, height, weight, fitness, bmi, pathologies, userKey], (err, data) => {
            if (err && err.errno==1305) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data["affectedRows"] == 0) {
                resolve(0);
            }
            else {
                resolve(2);
            }
        });
    });
};

function selectClientInfo(mail, userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL spSelectClientInfo(?,?)';

        dbconnection.query(sql, [mail, userKey], (err, data) => {
            if (err) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data.length > 0 && data[0].length > 0) {
                resolve(data);
            }
            else {
                resolve(2);
            }
        });
    });
};

function finalizeClientPayment(mail, modality, amount, transID, userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL spFinalizeClientPayment(?,?,?,?,?)';

        dbconnection.query(sql, [mail, modality, amount, transID, userKey], (err, data) => {
            if (err) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data["affectedRows"] == 1) { 
                resolve(0);
            }
            else {
                resolve(2);
            }
        });
    });
};

function selectLatestClientPayment(mail, userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL spSelectLatestClientPayment(?,?)';

        dbconnection.query(sql, [mail, userKey], (err, data) => {
            if (err) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data.length > 0 && data[0].length > 0) { 
                resolve(data);
            }
            else {
                resolve(2);
            }
        });
    });
};

function associateInstructor(clientEmail, instructorEmail, userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL spAssociateInstructor(?,?,?)';

        dbconnection.query(sql, [clientEmail, instructorEmail, userKey], (err, data) => {
            if (err && err.errno==1062) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data["affectedRows"] == 0) { 
                resolve(0);
            }
            else {
                resolve(2);
            }
        });
    });
};

function isClientAssociated(clientEmail, userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL spIsClientAssociated(?,?)';

        dbconnection.query(sql, [clientEmail, userKey], (err, data) => {

            if (err) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data.length > 0 && data[0].length > 0) { 
                resolve(data);
            }
            else {
                resolve(2);
            }
        });
    });
};

function selectAssociatedInstructor(clientEmail, userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL spSelectAssociatedInstructor(?,?)';

        dbconnection.query(sql, [clientEmail, userKey], (err, data) => {
            console.log(err);
            console.log(data);
            if (err) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data.length > 0 && data[0].length > 0) { 
                resolve(data);
            }
            else {
                resolve(2);
            }
        });
    });
};

function clientReviewInstructor(clientEmail, instructorEmail, rating, review, userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL spClientReviewInstructor(?,?,?,?,?)';

        dbconnection.query(sql, [clientEmail, instructorEmail, rating, review, userKey], (err, data) => {
            if (err && err.errno==1062) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data["affectedRows"] == 0) { 
                resolve(0);
            }
            else {
                resolve(2);
            }
        });
    });
};

function selectClientPaymentHistory(mail, userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL spSelectClientPaymentHistory(?,?)';

        dbconnection.query(sql, [mail, userKey], (err, data) => {
            if (err) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data.length > 0 && data[0].length > 0) {
                resolve(data);
            }
            else {
                resolve(2);
            }
        });
    });
};

function selectClientInstructorHistory(mail, userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL spSelectClientInstructorHistory(?,?)';

        dbconnection.query(sql, [mail, userKey], (err, data) => {
            if (err) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data.length > 0 && data[0].length > 0) {
                resolve(data);
            }
            else {
                resolve(2);
            }
        });
    });
};

function addClientRewards(mail, rewardID, userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL spAddClientRewards(?,?,?)';

        dbconnection.query(sql, [mail, rewardID, userKey], (err, data) => {
            if (err) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data["affectedRows"] == 0) {
                resolve(0);
            }
            else {
                resolve(2);
            }
        });
    });
};

function selectClientRewards(mail, userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL spSelectClientRewards(?,?)';

        dbconnection.query(sql, [mail, userKey], (err, data) => {
            if (err) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data.length > 0 && data[0].length > 0) {
                resolve(data);
            }
            else {
                resolve(2);
            }
        });
    });
};

function  selectClientPrograms(mail, userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL  spSelectClientPrograms(?,?)';

        dbconnection.query(sql, [mail, userKey], (err, data) => {
            if (err) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data.length > 0 && data[0].length > 0) {
                resolve(data);
            }
            else {
                resolve(2);
            }
        });
    });
};


function  selectAvailableInstructors(userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL  spSelectAvailableInstructors(?)';

        dbconnection.query(sql, [userKey], (err, data) => {
            if (err) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data.length > 0 && data[0].length > 0) {
                resolve(data);
            }
            else {
                resolve(2);
            }
        });
    });
};

function  selectDefaultExercises() {
    return new Promise((resolve) => {

        var sql = 'CALL  spSelectDefaultExercises()';

        dbconnection.query(sql, (err, data) => {
            if (err) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data.length > 0 && data[0].length > 0) {
                resolve(data);
            }
            else {
                resolve(2);
            }
        });
    });
};

function  selectDefaultPrograms() {
    return new Promise((resolve) => {

        var sql = 'CALL  spSelectDefaultExercises()';

        dbconnection.query(sql, (err, data) => {
            if (err) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data.length > 0 && data[0].length > 0) {
                resolve(data);
            }
            else {
                resolve(2);
            }
        });
    });
};

function addUserImage(mail, imagePath, userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL spUserAddImage(?,?,?)';

        dbconnection.query(sql, [mail, imagePath, userKey], (err, data) => {
            if (err) {
                resolve(1);
            }
            else if (typeof data !== 'undefined' && data["affectedRows"] == 0) {
                resolve(0);
            }
            else {
                resolve(2);
            }
        });
    });
};

/*
*******************************************
            USER DEFINED FUNCTIONS                
*******************************************
*/