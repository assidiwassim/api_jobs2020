
var express = require('express');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


var mysql_config = require('./config/config.js');
mysql_config.getConnection(function (err, con) {
    if (err) throw err;
    console.log("Database Connected! ");

    var sql = "CREATE TABLE IF NOT EXISTS users (name VARCHAR(255),skills VARCHAR(255),category VARCHAR(255),email VARCHAR(255), password VARCHAR(255))";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table created");
    });

});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/users', usersRouter);


var port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("server is running" +port)
})


module.exports = app;
