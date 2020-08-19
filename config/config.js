var mysql  = require('mysql');

module.exports = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database : 'jobs2020'
})