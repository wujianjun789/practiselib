const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const routes = require('./routes/index');
const users = require('./routes/users');

const app = express();
app.set('mode', 'prod');
const args = process.argv.splice(2);
args.forEach(item=>{
  const ikv = item.split('=');
  const key = ikv[0];
  const value = ikv[1];
  switch (key){
    case '--dev':
      app.set('mode', 'dev');
      break;
  }
})
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({resave:false, saveUninitialized:true, secret:'starriver'}))

app.use(function (req, res, next) {
  // if(req.originalUrl != "/login" && !req.session.user){
  //   res.redirect("/login");
  // }else{
  //   next();
  // }
  next();
})

app.use('/', routes);
app.use('/users', users);

const mode = app.get('mode');
if(mode === 'dev'){
  const  proxy = require('express-http-proxy');
  app.use(proxy('http://localhost:18080'));
}else{
  app.use(express.static(path.resolve(__dirname, '../app/public')))

  //error handler
  app.use(function (req, res, next) {
    next(new Error("404"));
  })

  app.use(function (err, req, res, next) {
    res.sendFile(path.resolve(__dirname, '../app/public/index.html'), (err) => {
      next(err);
    });

  });
}

// no stacktraces leaked to user
module.exports = app;
