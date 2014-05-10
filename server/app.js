'use strict';

var express = require('express');
var morgan  = require('morgan');
var hbs = require('hbs');

var app = express();
app.engine('hbs', require('hbs').__express);

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(express.static(__dirname + '/../public'));

var env = process.env.NODE_ENV || 'development';
if ('development' === env) {
   app.use(morgan('dev'));
}

app.get('/', function(req, res) {
    res.render('index', { title: 'Draw!' });
});

app.get('/map', function(req, res) {
    res.render('map', { title: 'Map!' });
});

module.exports = app;
