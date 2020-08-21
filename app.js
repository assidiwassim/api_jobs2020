
var express = require('express');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


var mysql_config = require('./config/config.js');
mysql_config.getConnection(function (err, con) {
    if (err) throw err;
    console.log("Database Connected! ")

     sql = "CREATE TABLE IF NOT EXISTS jobs2020.users (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,name VARCHAR(255),role VARCHAR(255),email VARCHAR(255),profile LONGTEXT, password VARCHAR(255));";
    con.query(sql);

     sql = "CREATE TABLE IF NOT EXISTS jobs2020.jobs (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,jobtitle VARCHAR(255),category VARCHAR(255),tags VARCHAR(255),job_type VARCHAR(255), condidate_region VARCHAR(255), price VARCHAR(255),description LONGTEXT, company_id int,date DATETIME , FOREIGN KEY (company_id) REFERENCES users(id) );";
    con.query(sql);

});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var jobsRouter = require('./routes/jobs');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/jobs', jobsRouter);

var port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("server is running" +port)
})


module.exports = app;
