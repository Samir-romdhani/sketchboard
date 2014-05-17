'use strict';

var Stage = require('./components/stage.js');
var Renderer = require('./components/renderer.js');

var stage = new Stage();
var render = new Renderer();

var Grid = require('grid.js');
var grid = new Grid({ path: '/api', reliable: true });

var through = require('through2');

grid.on('ready', function (id) {
    console.log('Connected to Grid (' + id + ')');
});

grid.on('connection', function (conn, id) {
    var sc = stage.model.createStream();
    conn.on('open', function () {
        console.log('Opened connection to ' + id);
        sc.pipe(through.obj(function (obj, e, cb) {
            try {
                conn.send(obj);
            } catch (e) {
                console.log('Failed to send ', obj);
            }
            cb();
        }));

        var incoming = through.obj();
        conn.on('message', function (msg) {
            incoming.push(msg.data);
        });

        incoming.pipe(sc);
    });
    conn.on('close', function () {
        sc.destroy();
    });
});

grid.on('disconnect', function (id) {

});

render.on('frame', function () {
    this.renderer.render(stage);
});
