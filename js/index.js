'use strict';

var PIXI = require('pixi.js/bin/pixi.dev.js');
var TilingBG = require('./components/tiling-bg.js');
var DOCDrag = require('./components/doc-drag.js');
var Sidebar = require('./components/sidebar.js');
var Colorsbar = require('./components/colorsbar.js');

var stage = new PIXI.Stage(0xFFFFFF, true);
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);

renderer.view.style.position = 'absolute';
renderer.view.style.top = '0px';
renderer.view.style.left = '0px';
document.body.appendChild(renderer.view);

var bg = new TilingBG();
stage.addChild(bg);

var docDrag = new DOCDrag(bg);

docDrag.on('drag', function (d) {
    if (!moving) { return; }
    bg.tilePosition.x -= d.x;
    bg.tilePosition.y -= d.y;
    graphics.position.x -= d.x;
    graphics.position.y -= d.y;
});

docDrag.on('line', function (a, b) {
    if (moving) { return; }
    graphics.lineStyle(2, color, 1);
    graphics.moveTo(a.x - graphics.position.x, a.y - graphics.position.y);
    graphics.lineTo(b.x - graphics.position.x, b.y - graphics.position.y);
    graphics.endFill();
});

stage.addChild(docDrag);

// var text = new PIXI.Text(docDrag.quadrant(), { font: '12px verdana', fill: 'black' });
// text.position.x = 20;
// text.position.y = 20;
// stage.addChild(text);

var sidebar = new Sidebar();
sidebar.position.x = 20;
sidebar.position.y = 50;

var moving = true;
sidebar.on('move-button', function () {
    moving = true;
});

sidebar.on('brush-button', function () {
    moving = false;
});

stage.addChild(sidebar);

var colorsbar = new Colorsbar();
colorsbar.position.x = 20;
colorsbar.position.y = 100;

var color;
colorsbar.on('color', function (clr) {
    color = clr;
});

stage.addChild(colorsbar);

var graphics = new PIXI.Graphics();
stage.addChild(graphics);

function animate() {
    // text.setText(docDrag.quadrant());
    renderer.render(stage);
    window.requestAnimFrame(animate);
}

window.requestAnimFrame(animate);
