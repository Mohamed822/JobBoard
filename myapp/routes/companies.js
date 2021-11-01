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
    con.query("SELECT * FROM Company", function (err, result, fields) {
      if (err) throw err;
      res.send(result)
    });
  });
});

router.get('/:id', function(req, res){
  var id = req.params.id;  
  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM Company WHERE id = ?",id, function (err, result, fields) {
      if (err) throw err;
      res.send(result)
    });
  });
});

router.post('/', function (req, res) {
  let Name = req.body.Name;
  let Address = req.body.Address;
  let Tel = req.body.Tel;
  let Email = req.body.Email;
  let Date_Cr = req.body.Date_Cr;
  let Sector = req.body.Sector;
  con.connect(function (err) {
    if (err) throw err;
    con.query(
        'INSERT INTO Company (Name, Address, Tel, Email, Date_Cr, Sector) VALUES (?,?,?,?,?,?)',
        [Name,Address,Tel,Email,Date_Cr,Sector],
        function (err, result, fields) {
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
  var sqlQuery = `UPDATE Company SET ${queryUpdate} WHERE id = ?`
  con.connect((err) => {
    if(err) throw err;
    con.query(sqlQuery,valuesBody, (err,result) => {
      if(err) throw err;
      res.send(result);
    });
  });
});
router.delete('/:id', function(req,res){
    var companyId = req.params.id;
    con.connect(function(err){
      if(err) throw err;
      con.query(`DELETE FROM Company WHERE id = ?`,companyId, function(err,result){
        if(err) throw err;
        res.send(result);
      })
    })
  });

module.exports = router;

