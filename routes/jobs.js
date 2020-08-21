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
    company_id: req.body.company_id,
  }

  mysql_config.getConnection(function (err, con) {
      if (err) throw err;
      var sql = "INSERT INTO jobs (jobtitle, category,tags,job_type,condidate_region,price,description,company_id) VALUES ('"+jobData.jobtitle+"', '"+jobData.category+"','"+jobData.tags+"','"+jobData.job_type+"','"+jobData.condidate_region+"','"+jobData.price+"','"+jobData.description+"','"+jobData.company_id+"')";
      con.query(sql, function (err, result) {
        if (err) throw err;
        res.json({ message: 'job save successfully !' })
      });
  });
});


router.get('/all', function(req, res, next) {

  mysql_config.getConnection(function (err, con) {
      if (err) throw err;
      var sql = "SELECT *  FROM jobs INNER JOIN users ON users.id = jobs.company_id ";
      con.query(sql, function (err, result) {
        if (err) throw err;
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
