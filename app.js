var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const cors=require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var itemsRouter = require('./routes/items');
var authenRouter = require('./routes/authen');
var productsRouter = require('./routes/products');
var studentsRouter = require('./routes/student');
var classRoomRouter = require('./routes/classRoom');
var categoryRouter = require('./routes/category');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/items',itemsRouter);
app.use('/authen',authenRouter);
app.use('/products',productsRouter);
app.use('/students',studentsRouter);
app.use('/class',classRoomRouter);
app.use('/category',categoryRouter);


mongoose.connect("mongodb://127.0.0.1:27017/TestS2");
mongoose.connection.once('open', function(){
  console.log("thanh cong");
});
mongoose.connection.on('error', function(){
  console.log(" k thanh cong");
});



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