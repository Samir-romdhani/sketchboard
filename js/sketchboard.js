'use strict';

var Stage = require('./components/stage.js');
var Renderer = require('./components/renderer.js');

var stage = new Stage();
var render = new Renderer();

var Grid = require('grid.js');
var grid = new Grid({ path: '/api' });

grid.on('ready', function (id) {
    console.log('Connected to Grid (' + id + ')');
});

grid.on('connection', function (conn, id) {
    console.log('Got connection in Grid (' + id + ')');
    stage.model.pipe(conn.createWriteableStream({ tag: 'scuttlebutt' }));
    conn.createReadableStream({ tag: 'scuttlebutt' }).pipe(stage.model);
});

grid.on('disconnect', function (id) {

});

render.on('frame', function () {
    this.renderer.render(stage);
});
