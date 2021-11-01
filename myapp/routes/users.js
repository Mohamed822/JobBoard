var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var mysql = require('mysql2');
var config = require('../config/config');
var jwt = require('jsonwebtoken');
var multer = require('multer')

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "JobBoard"
});

router.get('/', function (req, res) {
  con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM People", function (err, result) {
      if (err) throw err;
      res.send(result)
    });
  });
});

router.get('/:id', function (req, res) {
  const id = req.params.id;
  con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM People WHERE id = ?",id, function (err, result) {
      if (err) throw err;
      const arr = result;
      const id = arr[0].id;
      const imgType = arr[0].imgType;
      var img = `${__dirname}/img/${id}.png`;
      if(imgType === 'jpg'){
        img =  `${__dirname}/img/${id}.jpg`;
      }
      const pdf = `${__dirname}/pdf/${id}.pdf`
      arr[0].pdf = pdf;
      arr[0].img = img;
      res.send(arr)
    });
  });
});
router.post('/', async function (req, res) {
  let Bio = '';
  let id_Comp = 0;
  let image = '';
  let Name = req.body.Name;
  let Surname = req.body.Surname;
  let Email = req.body.Email;
  let Tel = req.body.Tel;
  let Status = req.body.Status;
  let Password = req.body.Password;
  const salt = await bcrypt.genSalt(10);
  let hashedPassword = '';
  //For user applicant
  if (Status === 0) {
    Bio = req.body.Bio;
    hashedPassword = await bcrypt.hash(Password, salt);
    image = req.body.imgType;
  }
    //For user recruiter
    if (Status === 1) {
      id_Comp = req.body.id_Comp
      hashedPassword = await bcrypt.hash(Password, salt);
    }
    //For admin user
    else {
      hashedPassword = await bcrypt.hash(Password, salt);
    }
    con.connect(function (err) {
      if (err) throw err;
      var findEmailQuery = 'SELECT * FROM People WHERE Email = ?';
      con.query(findEmailQuery,Email,function(err,result)  {
        if(err) res.send(err);
        if (result.length !== 0) {
          if(result[0].Status === 3 ){
            res.send({message:'visitor'})
          }
          else {
            res.send(false)
          }
        }
        else {
          var sqlQuery = `INSERT INTO People (Name, Surname, Email, Password, Tel, Status, id_Comp, Bio,imgType ) VALUES (?,?,?,?,?,?,?,?,?)`
          con.query(sqlQuery, [Name, Surname, Email, hashedPassword, Tel, Status, id_Comp, Bio,image], function (err, result) {
            if (err) throw err;
            res.send(result);
          });
        }
      })
    });
});

router.put('/resetpassword', async function (req, res) {
  let userID = req.body.id;
  let password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(password, salt);
  con.connect((err) => {
    if (err) throw err;
    var sqlQuery = `SELECT * FROM People WHERE id = ?`;
    con.query(sqlQuery, userID, async (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result.length === 0) {
          res.send({ success: false, message: 'Email' })
        } else {
          let body = req.body;
          let keysBody = Object.keys(body);
          const di = keysBody.shift();
          var queryUpdate = '' + keysBody.join('=?, ') + '=?';
          var valuesBody = Object.values(body);
          var idUser = valuesBody.shift();
          valuesBody.push(idUser);
          var sqlQuery = `UPDATE People SET ${queryUpdate} WHERE id = ?`;
          con.connect((err) => {
            if (err) throw err;
            con.query(sqlQuery, valuesBody, (err, result) => {
              if (err) throw err;
              res.send(result);
            });
          });
        }
      }
    })
  })
})

router.post('/login', function (req, res) {
  let email = req.body.email;
  let password = req.body.password;
  var sqlQuery = `SELECT * FROM People WHERE Email = ?`;
  con.connect((err) => {
    if (err) throw err;
    con.query(sqlQuery, email, async (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result.length === 0) {
          res.send({ success: false, message: 'Email' })
        } else {
          const sqlPassword = result[0].Password;
          const Name = result[0].Name;
          const id = result[0].id;
          const status = result[0].Status;
          const TOKEN_KEY = config.tokenKey
          const hash = await bcrypt.compare(password, sqlPassword);
          if (hash) {
            const jwtToken = jwt.sign(
              { userID: id, userName: Name, status:status },
              TOKEN_KEY,
              {
                expiresIn: "2h",
              }
            );
            res.send({ success: true, token: jwtToken });
          } else {
            if(status === 3){
              res.send({success:false, message:'visitor'})
            }
            else {
              res.send({ success: false, message: 'Password' })
            }
          }
        }
      }
    })
  })
})

  router.post('/:id/file', function (req, res) {
    const id = req.params.id;
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        if(file.originalname.slice(-3) === 'pdf'){
          cb(null, `routes/pdf`);
        }
        else {
          cb(null,'routes/img');
        }
      },
      filename: function (req, file, cb) {
        if(file.originalname.slice(-3) === 'png'){
          cb(null, id+'.png');
        }
        if(file.originalname.slice(-4) === 'jpg'){
          cb(null, id+'.jpg');
        }
        if(file.originalname.slice(-3) === 'pdf'){
          cb(null, id+'.pdf');
        }      
      }
    })

    var upload = multer({ storage: storage }).single('file')
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err)
      } else if (err) {
        return res.status(500).json(err)
      }
      return res.status(200).send(req.file)

    })
  })
  router.post('/:id/img', function (req, res) {
    const id = req.params.id;
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, `routes/img`)
      },
      filename: function (req, file, cb) {
        cb(null, id+'.png')
      }
    })

    var upload = multer({ storage: storage }).single('file')
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err)
      } else if (err) {
        return res.status(500).json(err)
      }
      return res.status(200).send(req.file)

    })
  })

router.put('/', function (req, res) {
  let body = req.body;
  let keysBody = Object.keys(body);
  const di = keysBody.shift();
  var queryUpdate = '' + keysBody.join('=?, ') + '=?';
  var valuesBody = Object.values(body);
  var idUser = valuesBody.shift();
  valuesBody.push(idUser);
  var sqlQuery = `UPDATE People SET ${queryUpdate} WHERE id = ?`
  con.connect((err) => {
    if (err) throw err;
    con.query(sqlQuery, valuesBody, (err, result) => {
      if (err) res.status(300).send(err);
      res.status(200).send(true);
    });
  });
});

router.delete('/:id', function (req, res) {
  var userID = req.params.id;
  con.connect(function (err) {
    if (err) throw err;
    var sqlQuery = `DELETE FROM People WHERE id = ?`;
    con.query(sqlQuery, userID, function (err, result) {
      if (err) throw err;
      res.send(result);
    })
  })
});


module.exports = router;
