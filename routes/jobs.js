var express = require('express');
var router = express.Router();
var mysql_config = require('../config/config.js');


router.post('/add', function(req, res, next) {

  const jobData = {
    jobtitle: req.body.jobtitle,
    category: req.body.category,
    tags: JSON.stringify(req.body.tags),
    job_type: req.body.job_type,
    condidate_region: req.body.condidate_region,
    price: req.body.price,
    description: req.body.description,
    company_id:  parseInt(req.body.company_id),
    date : new Date().toISOString().slice(0, 19).replace('T', ' ')
  }

  mysql_config.getConnection(function (err, con) {
      if (err) throw err;
      var sql = "INSERT INTO jobs (jobtitle, category,tags,job_type,condidate_region,price,description,company_id,date) VALUES ('"+jobData.jobtitle+"', '"+jobData.category+"','"+jobData.tags+"','"+jobData.job_type+"','"+jobData.condidate_region+"','"+jobData.price+"','"+jobData.description+"',"+jobData.company_id+",'"+jobData.date+"')";
      con.query(sql, function (err, result) {
        if (err) throw err;
        res.json({ message: 'job save successfully !' })
      });
  });
});


router.get('/all', function(req, res, next) {
  var sql ;
  var keyword =  req.query.keyword;
  var user_profile =  req.query.user_profile;

  if(keyword){
    console.log(keyword)
    sql = "SELECT *  FROM jobs INNER JOIN users ON users.id = jobs.company_id where jobtitle LIKE '%"+keyword+"%' or description LIKE '%"+keyword+"%' ORDER BY date DESC ";
  }else if(user_profile){
  
    console.log(user_profile)
    /*  standardidation : user_profile={"category":"dev web","skills":["nodejs","python","java"],"history":["css","js","wordpress"]} */

    var profile = JSON.parse(user_profile)
    var category = profile.category; // obligatoire
    var skills = profile.skills; // au min 1 skills
    var skills_to_sql =skills.join("|");  // "nodejs|python|java"

    var history = profile.history;  
    var history_to_sql =history.join("|");  // "nodejs|python|java"

    if(history){
      sql = "SELECT *  FROM jobs INNER JOIN users ON users.id = jobs.company_id where category LIKE '"+category+"' or jobtitle RLIKE '"+skills_to_sql+"' or description RLIKE '"+skills_to_sql+"' or tags RLIKE '"+skills_to_sql+"' or tags RLIKE '"+history_to_sql+"' ORDER BY date DESC";
    }else{
      sql = "SELECT *  FROM jobs INNER JOIN users ON users.id = jobs.company_id where category LIKE '"+category+"' or jobtitle RLIKE '"+skills_to_sql+"' or description RLIKE '"+skills_to_sql+"' or tags RLIKE '"+skills_to_sql+"' ORDER BY date DESC";
    }

    
  }else{
    console.log("no keyword")
    sql = "SELECT *  FROM jobs INNER JOIN users ON users.id = jobs.company_id ORDER BY date DESC";
  }

  

  mysql_config.getConnection(function (err, con) {
      if (err) throw err;
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(err)
        console.log(result)
        res.json({ data:result })
      });
  });
});


router.get('/find/:id', function(req, res, next) {

  var id = req.params.id; 

  mysql_config.getConnection(function (err, con) {
      if (err) throw err;
      var sql = "SELECT *  FROM jobs  INNER JOIN users ON users.id = jobs.company_id   where jobs.id = "+id+"";
      con.query(sql, function (err, result) {
        if (err) throw err;
        res.json({ data:result[0] })
      });
  });
});

module.exports = router;
