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

render.on('frame', function () {
    this.renderer.render(stage);
});
