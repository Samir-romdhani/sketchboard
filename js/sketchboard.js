'use strict';

var Stage = require('./components/stage.js');
var Renderer = require('./components/renderer.js');

var stage = new Stage();
var render = new Renderer();

var Grid = require('grid.js');
var grid = new Grid({ path: '/api' });

grid.signalingChannel.on('open', function () {
    console.log('Opened websocket connection');
});

grid.on('ready', function () {
    console.log('Connected to Grid');
});

render.on('frame', function () {
    this.renderer.render(stage);
});
