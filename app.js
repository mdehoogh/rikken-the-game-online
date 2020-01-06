const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');

// MONGOOSE SETUP
const mongoose     = require('mongoose');
mongoose.connect('mongodb://localhost/rikken-the-game-online');
// END MONGOOSE SETUP

// EXPRESS SERVER SETUP
const express      = require('express');
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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// default value for title local
app.locals.title = 'Rikken - het spel';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

const index = require('./routes/index');
app.use('/', index);

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

server.listen(3000,()=>{
  console.log("Express server listening on port 3000.");
});

module.exports = app;
