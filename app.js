
var express = require('express');
var app = express();
var cors = require('cors');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: '*'
}));

app.use(function (req, res, next) {
  /*var err = new Error('Not Found');
   err.status = 404;
   next(err);*/

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // Pass to next layer of middleware
  next();
});

var mysql_config = require('./config/config.js');
mysql_config.getConnection(function (err, con) {
  con.release();
    if (err) throw err;
    console.log("Database Connected! ")

     sql = "CREATE TABLE IF NOT EXISTS jobs2020.users (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,name VARCHAR(255),role VARCHAR(255),email VARCHAR(255),profile LONGTEXT, password VARCHAR(255));";
    con.query(sql);

     sql = "CREATE TABLE IF NOT EXISTS jobs2020.jobs (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,jobtitle VARCHAR(255),category VARCHAR(255),skills VARCHAR(255),job_type VARCHAR(255), condidate_region VARCHAR(255), price VARCHAR(255),company_url VARCHAR(255),snippet VARCHAR(255),description LONGTEXT, company_id int,date DATETIME , FOREIGN KEY (company_id) REFERENCES users(id) );";
    con.query(sql);

});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var jobsRouter = require('./routes/jobs');

app.use('/', indexRouter);
app.use('/users', usersRouter); //=> /users/register    /users/login
app.use('/jobs', jobsRouter); //=> /jobs/all       /jobs/add   /jobs/find/:id

var port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("server is running" +port)
})


module.exports = app;
