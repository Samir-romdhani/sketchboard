'use strict';

var express = require('express');
var morgan  = require('morgan');

var app = express();
app.engine('hbs', require('hbs').__express);

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/../public'));

var env = process.env.NODE_ENV || 'development';
if ('development' === env) {
   app.use(morgan('dev'));
}

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/sketch', function(req, res) {
    res.render('sketch');
});

module.exports = app;
