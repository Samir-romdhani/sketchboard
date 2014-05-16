'use strict';

var PIXI = require('pixi.js/bin/pixi.dev.js');
var TilingBG = require('./tiling-bg.js');
var DOCDrag = require('./doc-drag.js');
var Sidebar = require('./sidebar.js');
var Colorsbar = require('./colorsbar.js');

var _ = require('lodash');
var Emitter = require('wildemitter');

var quadrant = {
    x: 0x0BAD,
    y: 0xFACE,
    toString: function () {
        return this.x.toString(16) + " : " + this.y.toString(16);
    },
    update: function (p) {
        this.x = Math.floor(p.x / 100);
        this.y = Math.floor(p.y / 100);
    }
}

var Stage = function () {
    PIXI.Stage.call(this, 0xFFFFFF, true);

    var bg = new TilingBG();
    this.addChild(bg);

    var docDrag = new DOCDrag(bg);

    this.quadrant = quadrant;

    docDrag.on('drag', function (d) {
        if (!moving) { return; }
        bg.tilePosition.x -= d.x;
        bg.tilePosition.y -= d.y;
        graphics.position.x -= d.x;
        graphics.position.y -= d.y;

        quadrant.update(graphics.position);
        quadrantText.setText(quadrant.toString());
    });

    docDrag.on('line', function (a, b) {
        if (moving) { return; }
        graphics.lineStyle(2, color, 1);
        graphics.moveTo(a.x - graphics.position.x, a.y - graphics.position.y);
        graphics.lineTo(b.x - graphics.position.x, b.y - graphics.position.y);
        graphics.endFill();
    });

    this.addChild(docDrag);

    var graphics = new PIXI.Graphics();
    graphics.position.x = quadrant.x * 100;
    graphics.position.y = quadrant.y * 100;
    this.addChild(graphics);

    var quadrantText = new PIXI.Text(quadrant.toString(), { font: '12px verdana', fill: 'black' });
    quadrantText.position.x = 20;
    quadrantText.position.y = 20;
    this.addChild(quadrantText);

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

    this.addChild(sidebar);

    var colorsbar = new Colorsbar();
    colorsbar.position.x = 20;
    colorsbar.position.y = 100;

    var color;
    colorsbar.on('color', function (clr) {
        sidebar.emit('brush-button');
        color = clr;
    });

    this.addChild(colorsbar);
};

Stage.prototype = PIXI.Stage.prototype;
_.mixin(Stage.prototype, Emitter.prototype);

module.exports = Stage;
