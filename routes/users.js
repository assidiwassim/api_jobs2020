var express = require('express');
var router = express.Router();

process.env.SECRET_KEY = 'secret'
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

var mysql_config = require('../config/config.js');


router.post('/register', function(req, res, next) {

    const userData = {
      name: req.body.name,
      skills: req.body.skills,
      category: req.body.category,
      email: req.body.email,
      password: req.body.password,
    }

    mysql_config.getConnection(function (err, con) {
        if (err) throw err;
        var sql = "SELECT count(*) as nbr FROM users WHERE email = '"+userData.email+"'"
          con.query(sql, function (err, result) {
                  if (err) throw err;
                  if(result[0].nbr==0){
                    bcrypt.hash(userData.password, 10, (err, hash_password) => {
                      userData.password=hash_password
                      var sql = "INSERT INTO users (name, skills,category,email,password) VALUES ('"+userData.name+"', '"+userData.skills+"','"+userData.category+"','"+userData.email+"','"+userData.password+"')";
                      con.query(sql, function (err, result) {
                        if (err) throw err;
                        res.json({ message: 'User registered successfully !' })
                      });
                    }) 
                  }else{
                      res.json({ message: 'User already registered !' })
                  }            
          });
    });
});

router.post('/login', function(req, res, next) {

  const userData = {
    email: req.body.email,
    password: req.body.password,
  }

  mysql_config.getConnection(function (err, con) {
      if (err) throw err;
      var sql = "SELECT email,password  FROM users WHERE email = '"+userData.email+"'"
        con.query(sql, function (err, result) {
                if (err) throw err;

                if (result.length>0 && bcrypt.compareSync(userData.password, result[0].password)) {

                      payload = {
                        id: result[0].id,
                        email: result[0].email
                      }

                    let token = jwt.sign(payload, process.env.SECRET_KEY)

                      payload = {
                        id: result[0].id,
                        email: result[0].email,
                        token : token
                      }

                      res.json({ message: 'User connected successfully ! ',payload:payload })

                }else{
                  res.json({ message: 'Incorrect login or password !' })
                }
                      
        });
  });
});

module.exports = router;
