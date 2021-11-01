var express = require('express');
var router = express.Router();
var mysql = require('mysql2');


let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "JobBoard"
});

router.get('/', function(req, res){  
  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM advertisements", function (err, result, fields) {
      if (err) throw err;
      res.send(result)
    });
  });
});

router.post('/', function (req, res) {
  let Company = req.body.Company;
  let id_Comp = req.body.id_Comp;
  let Description = req.body.Description;
  let Short_desc = req.body.Short_desc;  
  let Salary = req.body.Salary;
  let Work_hours = req.body.Work_hours;
  let Start_date = req.body.Start_date;
  let id_recruiter = req.body.id_recruiter;
  let recruiter_email = req.body.recruiter_email;
  let Place = req.body.Place;
  let Job = req.body.Job;
  con.connect(function (err) {
    if (err) throw err;
    var sqlQuery = `INSERT INTO advertisements (Company, id_Comp, id_recruiter, recruiter_email, Description, Short_desc, Salary, Work_hours, Start_date, Place, Job) VALUES (?,?,?,?,?,?,?,?,?,?,?)`
    con.query(sqlQuery, [Company, id_Comp, id_recruiter,recruiter_email, Description,Short_desc,Salary,Work_hours,Start_date,Place,Job], function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
});

router.put('/', function(req, res) {
  let body = req.body;
  let keysBody = Object.keys(body);
  const di = keysBody.shift();
  var queryUpdate = ''+keysBody.join('=?, ')+'=?';
  var valuesBody = Object.values(body);
  var idJob = valuesBody.shift();
  valuesBody.push(idJob);
  var sqlQuery = `UPDATE advertisements SET ${queryUpdate} WHERE id = ?`
  con.connect((err) => {
    if(err) throw err;
    con.query(sqlQuery,valuesBody, (err,result) => {
      if(err) throw err;
      res.send(result);
    });
  });
});

router.delete('/:id', function(req,res){
  var jobId = req.params.id;
  con.connect(function(err){
    if(err) throw err;
    var sqlQuery = `DELETE FROM advertisements WHERE id = ?`;
    con.query(sqlQuery,jobId, function(err,result){
      if(err) throw err;
      res.send(result);
    })
  })
});


module.exports = router;
