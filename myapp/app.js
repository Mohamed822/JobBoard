var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var jobsRouter = require('./routes/jobs');
var usersRouter = require('./routes/users');
var companyRouter = require('./routes/companies');
var infosRouter = require('./routes/infos');

const corsOption = {
  origin:'http://localhost:3001',
  optionSuccessStatus:200
};


var app = express();
app.use(cors(corsOption));
app.use('/static',express.static('routes'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/test',(req,res)=>{
  console.log(req.url)
  res.send('success')
})
app.use('/jobs', jobsRouter);
app.use('/users', usersRouter);
app.use('/companies',companyRouter);
app.use('/infos',infosRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
