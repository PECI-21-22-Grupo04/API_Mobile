// Import utilities
const mysql = require('mysql');
const dotenv = require('dotenv').config();

module.exports = {
    createUser,
    selectUser
}

// Connect to database (MUST USE LEGACY AUTHENTICATION METHOD (RETAIN MYSQL 5.X COMPATIBILITY))
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


//******************************************//
//             Stored Procedures            //
//******************************************//

function createUser(mail, fName, lName, userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL spCreateUser(?,?,?,?)';

        dbconnection.query(sql, [mail, fName, lName, userKey], (err, data) => {
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

function selectUser(mail, userKey) {
    return new Promise((resolve) => {

        var sql = 'CALL spSelectUser(?,?)';

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


//******************************************//
//           USER DEFINED FUNCTIONS         //
//******************************************//

