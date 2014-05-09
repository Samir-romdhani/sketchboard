'use strict';

var app = require('./app.js');
var port = Number(process.env.PORT || 8080),
    url  = 'http://localhost:' + port + '/';

var server = app.listen(port, function () {
    console.log('Express server started.');
    console.log(url);
});

var grid = require('./grid.js');
app.use(grid({ server: server, path: '/api' }));

if (process.env.SUBDOMAIN) {
    url = 'http://' + process.env.SUBDOMAIN + '.jit.su/';
}
