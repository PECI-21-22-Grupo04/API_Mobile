module.exports = {
    createUser,
    selectUSer
}

createUser = function (mail,fName,lName,userKey) {
    return new Promise((resolve, reject) => {

        var sql = 'CALL spCreateUser(?,?,?,?)';

        dbconnection.query(sql, [mail,fName,lName,userKey], (err, data) => {
            if (err) {
                resolve(1);
            }
            if (typeof data !== 'undefined' && data.length > 0 || data["affectedRows"] == 1) {
                resolve(0);
            }
            else {
                resolve(2);
            }
        });
    });
};

selectUser = function (mail,userKey) {
    return new Promise((resolve, reject) => {

        var sql = 'CALL spSelectUser(?,?)';

        dbconnection.query(sql, [mail,userKey], (err, data) => {
            if (err) {
                resolve(1);
            }
            if (typeof data !== 'undefined' && data.length > 0 && data[0].length > 0) {
                resolve(data);
            }
            else {
                resolve(2);
            }
        });
    });
};