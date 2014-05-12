'use strict';

var app = require('./app.js');
var port = Number(process.env.PORT || 8080),
    url  = 'http://localhost:' + port + '/';

var Message = require('grid-protocol').Messages,
    _ = require('lodash');

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
    _(grid._sockets).forEach(function (socket, dest) {
        if (dest !== id) {
            try {
                socket.send(Message.Connected(id).toBuffer(), { binary: true });
            } catch (e) {}
        }
    });
});

grid.on('disconnect', function (id) {
    delete nodes[id];

    _(nodes).forEach(function(node) {
        delete node[id];
    });

    _(grid._sockets).forEach(function (socket, dest) {
        if (dest !== id) {
            try {
                socket.send(Message.Disconnected(id).toBuffer(), { binary: true });
            } catch (e) {}
        }
    });
});

var mongodb = require('./mongodb.js');

grid.on('message', function (message) {
    if (message.type !== 'LOG') { return; }

    mongodb.log(message);

    if (message.data.what === 'connecting') {
        nodes[message.source][message.data.where] = 1;
    }
    if (message.data.what === 'connected') {
        nodes[message.source][message.data.where] = 2;
    }
    if (message.data.what === 'disconnected') {
        delete nodes[message.source][message.data.from];
    }
});

if (process.env.SUBDOMAIN) {
    url = 'http://' + process.env.SUBDOMAIN + '.jit.su/';
}
