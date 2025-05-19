var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connectDB = require('./models/dbconfig');
const cors = require('cors');
require('dotenv').config();

var indexRouter = require('./routes/index').default;
const authRoutes = require('./routes/authRoutes');
const packageRoutes = require("./routes/packageRoutes");
const otpRoutes = require('./routes/otpRoutes');
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require('./routes/admin');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
connectDB();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use("/api", packageRoutes);
app.use("/api", otpRoutes);
// Use booking routes
app.use("/api", bookingRoutes);
app.use("/api/admin", adminRoutes); // ✅ Use admin routes



app.use('/', indexRouter);
app.use('/api', authRoutes);
app.use("/api/reviews", reviewRoutes);


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
