var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var http = require('http');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var morgan = require('morgan');
var cors = require('cors');



var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});


var app = express();
app.use(cors());
app.use(morgan('combined', {stream: accessLogStream}));

var user = require('./controllers/user');
var userrole = require('./controllers/userrole');
var lab = require('./controllers/lab');



app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/api/user', user);
app.use('/api/userrole', userrole);
app.use('/api/lab', lab);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {      
         res.send(err.status || 500,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":err.status || 500},"Result":err.message});
        
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {  

     res.send(err.status || 500,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":err.status || 500},"Result":err.message});
});


app.set('port', process.env.PORT || 8080);
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});


module.exports = app;

