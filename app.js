require('dotenv').config()

const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require("express-session");
const bcrypt       = require("bcryptjs");
const passport     = require("passport");
const ensureLogin  = require("connect-ensure-login");
const flash        = require("connect-flash");
const hbs          = require("hbs");

// MONGOOSE SETUP
const mongoose     = require('mongoose');
mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

//AUTH DATABASE CONNECT
mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/rikken-auth', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

// END MONGOOSE SETUP

// EXPRESS SERVER SETUP
const express=require('express');
const app=express();
// END EXPRESS SERVER SETUP

// SOCKET.IO SERVER SETUP
const server      = require('http').createServer(app);
const io          = require('socket.io')(server);

// define what to do when clients connect
io.on('connection', client => {
    console.log("Client: ",client);
    console.log("\tConnected!");
    // any client can disconnect!
    client.on('disconnect', () => { 
        console.log("Client: "+client);
        console.log("\tDisconnecting...");
    });
    // responding to any number of client events
    client.on('three-second counter', data => { 
        // TODO respond to event 'event'
        console.log("Client: "+client);
        console.log("\tReceived three-second counter data: ",data);
    });
});
// END SOCKET.IO SERVER SETUP

// MDH@11JAN2020: pretty essential to do the init BEFORE registering the helper AND then it works
// MDH@30JAN2020: copied over from test_gameplaying.js for internationalization support
const i18n=require('i18n');
i18n.configure({
    locales:['nl', 'en'],
    defaultLocale:'en',
    queryParameter: 'lang', // replacing: cookie:'locale' (which we do not have!!!!)
    directory: path.join(__dirname,'locales'),
});
i18n.setLocale('en'); // try it this way!!!!
app.use(i18n.init); // use internationalization
app.use(function(req, res, next) {
    hbs.registerHelper('__',function(){
        if(!this.locale){
            var args=Array.prototype.slice.call(arguments);
            var options=args.pop();
            return i18n.__.apply(options.data.root,args);
          }
          return i18n.__.apply(this,arguments);
    });
    next();
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// default value for title local
app.locals.title = "Rikken";

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname,'public')));

// passport init and config
app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//registering partials
hbs.registerPartials(__dirname + '/views/partials');

//routes

// const index = require('./routes/index');
// app.use('/',index);
app.use("/private-page", require("./routes/private-profile"));
app.use('/', require("./routes/auth-routes"));

// routes rendering
app.get('/', (req, res, next) => {
  res.render('home');
});

app.get('/wachten', (req, res, next) => {
  res.render('waiting');
});

// MDH@23JAN2020: if we really want to go gameplaying...
app.get('/spelen',(req,res,next)=>{
  // gameplaying.hbs assumes the name of the user is in the username variable!!!!
  if(req.user&&req.user.username)
    res.render('gameplaying',{username:req.user.username});
  else
    next(new Error("Log in first!"));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let port=(process.env.PORT||3000);
server.listen(port,()=>{
  console.log("Express server listening on port "+port+".");
  console.log("Google client ID: "+process.env.GOOGLE_CLIENT_ID+".");
  console.log("Google client secret: '"+process.env.GOOGLE_CLIENT_SECRET+".");
});

module.exports = app;
