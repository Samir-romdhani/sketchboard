'use strict';

var PIXI = require('pixi.js/bin/pixi.dev.js');
var TilingBG = require('./components/tiling-bg.js');
var DOCDrag = require('./components/doc-drag.js');
var Sidebar = require('./components/sidebar.js');

var stage = new PIXI.Stage(0xFFFFFF, true);
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);

renderer.view.style.position = 'absolute';
renderer.view.style.top = '0px';
renderer.view.style.left = '0px';
document.body.appendChild(renderer.view);

var bg = new TilingBG();
stage.addChild(bg);

var docDrag = new DOCDrag(bg);
docDrag.realPosition = { x: 3500000, y: 3500000 };
stage.addChild(docDrag);

var text = new PIXI.Text(docDrag.quadrant(), { font: '12px verdana', fill: 'black' });
text.position.x = 20;
text.position.y = 20;
stage.addChild(text);

var sidebar = new Sidebar();
stage.addChild(sidebar);

function animate() {
    text.setText(docDrag.quadrant());
    renderer.render(stage);
    window.requestAnimFrame(animate);
}

window.requestAnimFrame(animate);
