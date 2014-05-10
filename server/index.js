'use strict';

var app = require('./app.js');
var port = Number(process.env.PORT || 8080),
    url  = 'http://localhost:' + port + '/';

var server = app.listen(port, function () {
    console.log('Express server started.');
    console.log(url);
});

var grid = require('./grid.js')({ server: server, path: '/api' });

app.use(grid);

var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ server: server, path: '/map' }),
    PSON = require('pson'),
    pson = new PSON.StaticPair();

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('received: %s', message);
    });
    var opened = true;
    function send() {
        if (opened) {
            ws.send(pson.encode(nodes).toBuffer(), {binary: true});
            setTimeout(send, 1000);
        }
    }
    setTimeout(send, 500);
    ws.on('close', function () { opened = false; });
    ws.on('error', function () { opened = false; });
});

var nodes = {};

grid.on('connection', function (id) {
    nodes[id] = {};
});

grid.on('disconnect', function (id) {
    delete nodes[id];
});

grid.on('message', function (message) {
    if (message.type !== 'LOG') { return; }

    if (message.data.what === 'connecting') {
        nodes[message.source][message.dest] = 1;
    }
    if (message.data.what === 'connected') {
        nodes[message.source][message.dest] = 2;
    }
    if (message.data.what === 'disconnected') {
        delete nodes[message.source][message.dest];
    }
});

if (process.env.SUBDOMAIN) {
    url = 'http://' + process.env.SUBDOMAIN + '.jit.su/';
}
