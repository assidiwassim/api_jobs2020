var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');





var mysql_config = require('../config/config.js');

router.post('/add', function(req, res, next) {

  const jobData = {
    jobtitle: req.body.jobtitle,
    category: req.body.category,
    skills: JSON.stringify(req.body.skills),
    job_type: req.body.job_type,
    condidate_region: req.body.condidate_region,
    price: req.body.price,
    company_url:req.body.company_url,
    snippet:req.body.snippet,
    description:req.body.description,
    company_id:  parseInt(req.body.company_id),
    date : new Date().toISOString().slice(0, 19).replace('T', ' ')
  }


  //

  mysql_config.getConnection(function (err, con) {
    con.release();
      if (err) throw err;
      var sql = "INSERT INTO jobs (jobtitle, category,skills,job_type,condidate_region,price,company_url,snippet,description,company_id,date) VALUES ('"+jobData.jobtitle+"', '"+jobData.category+"','"+jobData.skills+"','"+jobData.job_type+"','"+jobData.condidate_region+"','"+jobData.price+"','"+jobData.company_url+"','"+jobData.snippet+"',"+con.escape(jobData.description)+","+jobData.company_id+",'"+jobData.date+"')";
      con.query(sql, function (err, result) {
        if (err) throw err;
        send_emails_users(req.body.skills,result.insertId)
        console.log(result)
        res.json({ message: 'job save successfully !' })
      });
  });
});


router.get('/all', function(req, res, next) {
  var sql ;
  var keyword =  req.query.keyword;
  var user_profile =  req.query.user_profile;

  if(keyword && keyword!=null){
    console.log("keyword **")
    sql = "SELECT *,jobs.id as _id   FROM jobs INNER JOIN users ON users.id = jobs.company_id where jobtitle LIKE '%"+keyword+"%' or description LIKE '%"+keyword+"%' ORDER BY date DESC ";
  }else if(user_profile && user_profile!=null){
    console.log("user_profile **")
    /*  standardidation : user_profile={"category":"dev web","skills":["nodejs","python","java"],"history":["css","js","wordpress"],"notif":["css","js","wordpress"]} */

    var profile = JSON.parse(user_profile)
  
    var category = profile.category;
    var skills = profile.skills; 
    var skills_to_sql =skills.join("|");  

    var history = profile.history;  
 
console.log(history)
    if(history && history.length>1){
      console.log("history **")
      var history_to_sql =history.join("|");  // "nodejs|python|java"

      console.log(history_to_sql)
      sql = "SELECT *,jobs.id as _id   FROM jobs INNER JOIN users ON users.id = jobs.company_id where category LIKE '"+category+"' or jobtitle RLIKE '"+skills_to_sql+"' or jobtitle RLIKE '"+history_to_sql+"' or description RLIKE '"+skills_to_sql+"' or skills RLIKE '"+skills_to_sql+"' or skills RLIKE '"+history_to_sql+"' ORDER BY date DESC";
    }else{
      console.log("profile skills category **")
      sql = "SELECT *,jobs.id as _id   FROM jobs INNER JOIN users ON users.id = jobs.company_id where category LIKE '"+category+"' or jobtitle RLIKE '"+skills_to_sql+"' or description RLIKE '"+skills_to_sql+"' or skills RLIKE '"+skills_to_sql+"' ORDER BY date DESC";
    }

    
  }else{
    console.log("all **")
    sql = "SELECT *,jobs.id as _id  FROM jobs INNER JOIN users ON users.id = jobs.company_id ORDER BY date DESC";
  }

  

  mysql_config.getConnection(function (err, con) {
    con.release();
      if (err) throw err;
      con.query(sql, function (err, result) {
        if (err) throw err;
        res.json({ data:result })
      });
  });
});


router.get('/find/:id', function(req, res, next) {

  var id = req.params.id; 

  mysql_config.getConnection(function (err, con) {
    con.release();
      if (err) throw err;
      var sql = "SELECT *,jobs.id as _id   FROM jobs  INNER JOIN users ON users.id = jobs.company_id   where jobs.id = "+id+"";
      con.query(sql, function (err, result) {
        if (err) throw err;
        res.json(result[0])
      });
  });
});





router.put('/find_user_and_update_notif/:id', function(req, res, next) {
 
  console.log("notif ---------")
  var id = req.params.id; 
  var keyword = req.body.keyword
  

  mysql_config.getConnection(function (err, con) {
    con.release();
      if (err){
        throw err;
      } 

      var sql = "SELECT *  FROM users WHERE id = "+id+""
        con.query(sql, function (err, result) {
          
               if (err){
                  throw err;
                } 
               
                if (result.length>0) {
                 
                   
                      profile=JSON.parse(result[0].profile)
                    
                      var notif = profile.notif

                      if(notif && notif.length>0){
                        
                        if(notif.indexOf(keyword)<0 ){
                          notif.push(keyword)
                        }
                        
                      }else{

                        notif=[]

                        if(notif.indexOf(keyword)<0 ){
                          notif.push(keyword)
                        }
                        
                      }

 
                      profile.notif = notif

                      var sql = "UPDATE  users  SET profile = '"+JSON.stringify(profile)+ "' WHERE id = "+id+""
                      con.query(sql, function (err, result) {
                             if (err){throw err;}
                              
                             res.json({ message: 'profile updated successfully  !' })
                            })
                     
                     
                }else{
                  res.json({ message: 'err' })
                }
                      
        });
  });



})



router.put('/find_user_and_update_hist2/:id', function(req, res, next) {
 
  console.log("history ---------")
  var id = req.params.id; 
  var keyword = req.body.keyword
  console.log("wsooool")
  console.log(keyword)
  console.log(id)

  mysql_config.getConnection(function (err, con) {
    con.release();
      if (err){
        console.log("err1")
        throw err;
      } 

      var sql = "SELECT *  FROM users WHERE id = "+id+""
        con.query(sql, function (err, result) {
          
               if (err){
                  throw err;
                } 
                console.log(result)
                if (result.length>0) {
                 
                   
                  console.log(result[0])
                      profile=JSON.parse(result[0].profile)
                    
                      var history = profile.history

                      if(history && history.length>0){
                        
                        if(history.indexOf(keyword)<0 ){
                          if(keyword!="" && keyword!=null)
                          history.push(keyword)
                        }
                        
                      }else{

                        history=[]

                        if(history.indexOf(keyword)<0 ){
                          if(keyword!="" && keyword!=null)
                          history.push(keyword)
                        }
                        
                      }

 
                      profile.history = history

                      console.log( profile.history)

                      var sql = "UPDATE  users  SET profile = '"+JSON.stringify(profile)+ "' WHERE id = "+id+""
                      con.query(sql, function (err, result) {
                             if (err){throw err;}
                              
                             res.json({ message: 'profile updated successfully  !' })
                            })
                     
                     
                }else{
                  res.json({ message: 'err' })
                }
                      
        });
  });



})


router.get('/test_email', function(req, res, next) {

  



  




}) 

router.get('/test_tags', function(req, res, next) {
  send_emails_users(["nodejs","java","wordpress"])
})

var transport = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 25,
  auth: {
   /* user: 'assidi.wassim.fsm.tp10@gmail.com',
    pass: 'developpeurWEB123456789'*/

    user: 'wassilaramli73@gmail.com',
    pass: 'S@usse73'
  }
}));

function send_emails_users(tags,id){

  mysql_config.getConnection(function (err, con) {
    con.release();
      if (err){
        throw err;
      } 
      var tags_to_sql =tags.join("|"); 

      var sql = "SELECT *  FROM users where profile RLIKE '"+tags_to_sql+"'"
        con.query(sql, function (err, result) {
          
               if (err){
                  throw err;
                } 
               
                if (result.length>0 ) {
                 
                  
                   result.forEach(element => {            

                      const message = {
                        from: "Dev Jobs  <wassilaramli73@gmail.com>",  
                        to: element.email,      
                        subject: "Dev Jobs notification  ", 
                        html:  '<br><a href=http://localhost:4200/job/'+id+' target="_blank">Cliquez ici</a>'
                      };
                  
                      transport.sendMail(message, function(err, info) {
                          if (err) {
                            console.log(err)
                            
                          } else {
                            console.log(info);
                           
                          }
                      });
    

                   });

                 

                   
                    
                     
                }else{
                  console.log("no")
                }
                      
        });
  });

}

module.exports = router;
