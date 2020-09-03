var express = require('express');
var router = express.Router();

process.env.SECRET_KEY = 'secret'
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

var mysql_config = require('../config/config.js');


router.post('/register', function(req, res, next) {
 
  var profile=null

  if(req.body.role=="developer"){
    profile={
      skills:req.body.skills,
      category: req.body.category,
      history:[],
      notif:[]
    }
    profile = JSON.stringify(profile)
  }else if(req.body.role=="company"){
    profile=req.body.logo
  }
    const userData = {
      name: req.body.name,
      role: req.body.role,
      email: req.body.email,
      profile: profile,
      password: req.body.password,
    }

    console.log(userData)
    
    mysql_config.getConnection(function (err, con) {
      con.release();
        if (err) throw err;
        var sql = "SELECT count(*) as nbr FROM users WHERE email = '"+userData.email+"'"
          con.query(sql, function (err, result) {
                  if (err) throw err;
                  if(result[0].nbr==0){
                    bcrypt.hash(userData.password, 10, (err, hash_password) => {
                      userData.password=hash_password
                      var sql = "INSERT INTO users (name, role,email,profile,password) VALUES ('"+userData.name+"', '"+userData.role+"','"+userData.email+"','"+userData.profile+"','"+userData.password+"')";
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
    con.release();
      if (err){
        console.log("err1")
        throw err;
      } 

      var sql = "SELECT *  FROM users WHERE email = '"+userData.email+"'"
        con.query(sql, function (err, result) {
          
               if (err){
                  throw err;
                } 
               
                if (result.length>0 && bcrypt.compareSync(userData.password, result[0].password)) {
                 
                    payload = {
                      id: result[0].id,
                      name: result[0].name,
                      role: result[0].role,
                      email: result[0].email,
                      profile: result[0].profile,
                    }
                 
                    let token = jwt.sign(payload, process.env.SECRET_KEY)
                 
                    payload = {
                      id: result[0].id,
                      name: result[0].name,
                      role: result[0].role,
                      email: result[0].email,
                      profile: result[0].profile,
                      token : token
                    }
                 
                      res.json(payload)
                     
                }else{
                  res.json({ message: 'Incorrect login or password !' })
                }
                      
        });
  });

  
});

module.exports = router;
