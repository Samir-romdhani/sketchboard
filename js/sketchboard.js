'use strict';

var Stage = require('./components/stage.js');
var Renderer = require('./components/renderer.js');

var stage = new Stage();
var render = new Renderer();

var Grid = require('grid.js');
var grid = new Grid({ path: '/api' });


grid.signalingChannel.on('message', function (msg) {
    if (msg.type === 'CONNECTED') {
        console.log('User ' + msg.id + ' connected');
        grid.log({ what: 'connecting', where: msg.id });
        var conn = grid.p2p.connect(msg.id);
        conn.on('open', function () {
            grid.log({ what: 'connected', where: msg.id });
            console.log('Connection to ' + msg.id + ' opened');
            setInterval(function () {
                conn.send('Hello ' + msg.id);
            }, 2000);
        });
        conn.on('close', function () {
            grid.log({ what: 'disconnected', from: msg.id });
        });
    }
});

grid.on('ready', function (id) {
    console.log('Connected to Grid (' + id + ')');
});

render.on('frame', function () {
    this.renderer.render(stage);
});
