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
    con.query("SELECT * FROM Information", function (err, result) {
      if (err) throw err;
      res.send(result)
    });
  });
});

router.post('/',async function (req, res) {
  let id_Ads = req.body.id_Ads;
  let id_Comp = req.body.id_Comp;
  let company_name = req.body.Company_name;
  let Applicant_email = req.body.Applicant_email;
  let id_recruiter = req.body.id_Recruiter;
  let recruiter_email = req.body.Recruiter_email;
  let Message = req.body.Message;
  let Name = req.body.Applicant_name;
  let Surname = req.body.Applicant_surname;
  let Tel = req.body.Tel;
  let Status = req.body.Status;
  let Bio = '';
  let CV = '';
  let image = '';
  let hashedPassword = '';

  con.connect(function (err) {
    if (err) throw err;
    var sqlQueryforInfosTable = `INSERT INTO Information (id_Ads, id_Comp,company_name, Applicant_email, id_recruiter, recruiter_email, Message) VALUES (?,?,?,?,?,?,?)`
    con.query(sqlQueryforInfosTable, [id_Ads, id_Comp,company_name,Applicant_email,id_recruiter,recruiter_email,Message], function (err, result1) {
      if (err) throw err;
      else {
        if(Status === 3) {
          var sqlQuery = `INSERT INTO People (Name, Surname, Email, Password, Tel, Status, id_Comp, Bio,imgType ) VALUES (?,?,?,?,?,?,?,?,?)`
          con.query(sqlQuery, [Name,Surname,Applicant_email,hashedPassword,Tel,Status, Status,Bio,image], function (err, result) {
            if (err) throw err;
            res.status(200).send(result);
          });
        }
        else {
          res.status(200).send(result1)
        }
      }
    });
  });
});



router.delete('/:id', function(req,res){
  var userID = req.params.id;
  con.connect(function(err){
    if(err) throw err;
    var sqlQuery = `DELETE FROM Information WHERE id = ?`;
    con.query(sqlQuery,userID, function(err,result){
      if(err) throw err;
      res.send(result);
    })
  })
});


module.exports = router;
