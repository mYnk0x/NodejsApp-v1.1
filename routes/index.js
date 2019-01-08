var express = require('express');
var router = express.Router();
var DataBase = require('../config/database.js');
var mysql = require('mysql');
var con = mysql.createConnection(DataBase);
/* GET home page. */

router.get('/', function(req, res, next) {    
  res.render('index', {title: 'Homepage'});
});

router.get('/login', function(req, res, next) {		
  res.render('login', { title: 'Login'});
});

router.post('/userValid', function(req, res, next) {		
  // console.log(req.body)
  data=req.body;
  username=data["user"]; //xss //SQL
  password=data["pass"]
  con.connect(function(err){
    sql ="select * from user where username='"+username+"' and password='"+password+"'";
  	con.query(sql,function(err,result){
  		if (err) throw err;
  		if (result.length > 0) {
        console.log('successfull');
        res.render('welcome', { title: 'Welcome', user:username, data: result});
      }
      else {
        res.redirect('login');
      }
    });
  });
});

router.post('/userCreate', function(req, res, next) {
  con.connect(function(err){
    sql="select username from user where username='"+req.body.user+"'";
    con.query(sql, function(err, result){
      if(err) throw err;
      if(result.length > 0 ){
        console.log(result);
        res.render('login', { again: 'User already exists. Try again.' });
      }
      else{
        sql="insert into user (username, password, fname, lname, occu) values('"+ req.body.user +"', '"+ req.body.pass +"', '"+ req.body.fname +"', '"+ req.body.lname +"', '"+ req.body.occu +"')";
        con.query(sql,function(err,result){
          if(err) throw err;
          if(result.affectedRows > 0) {
            console.log("Successfull");
            res.render('login', { success: 'Successfully registered. Please login.' });
          }
          else {
            console.log("Unsuccessfull");
            res.redirect('/');
          }
        });
      }
    });
  });
});

module.exports = router;