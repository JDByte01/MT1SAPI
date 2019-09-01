var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var LoginRouter = require('./routes/Login');
var MecanicoRouter = require('./routes/Mecanico');
var ClienteRouter = require('./routes/Cliente');
var MotoRouter = require('./routes/Moto');
var AceiteRouter = require('./routes/Aceite');
var UsuarioRouter = require('./routes/Usuario');
var OrdenRouter = require('./routes/Orden');
var TarjetaRouter = require('./routes/Tarjeta');
var VehiculoRouter = require('./routes/Vehiculo');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/Login', LoginRouter);
app.use('/Mecanico', MecanicoRouter);
app.use('/Cliente', ClienteRouter);
app.use('/Moto', MotoRouter);
app.use('/Aceite', AceiteRouter);
app.use('/Usuario', UsuarioRouter);
app.use('/Orden', OrdenRouter);
app.use('/Tarjeta', TarjetaRouter);
app.use('/Vehiculo', VehiculoRouter);

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
