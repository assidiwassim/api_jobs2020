var mysql  = require('mysql');

module.exports = mysql.createPool({
    connectionLimit :1000,
    host: "localhost",
    user: "root",
    password: "",
    database : 'jobs2020'
})