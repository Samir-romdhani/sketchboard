'use strict';

var PIXI = require('pixi.js/bin/pixi.dev.js');
var _ = require('lodash');
var Emitter = require('wildemitter');

var colors = [
    0xF57E20,
    0xFED833,
    0xCCCC51,
    0x8FB258,
    0x192B33,
    0x0099CC,
    0xCCFFCC,
    0x66CCFF,
    0x003399,
    0x000000,
    0xCC99CC,
    0xFFFFFF,
    0x660066,
    0xCE0000,
    0xFFFFFF,
    0xFFFFFF,
    0xFDE8D7
];

var Colorsbar = function () {
    PIXI.DisplayObjectContainer.call(this);
    Emitter.call(this);
    var colorsbar = this;

    var currentColor = new PIXI.Graphics();
    currentColor.beginFill(0x00000);
    currentColor.drawRect(0, 0, 76, 32);
    colorsbar.addChild(currentColor);

    _.forEach(colors, function (clr, i) {
        var color = new PIXI.Graphics();
        color.beginFill(clr);
        color.drawRect(0, 0, 16, 16);
        color.position.x = 20 * (i % 4);
        color.position.y = 40 + 20 * Math.floor(i / 4);

        color.hitArea = new PIXI.Rectangle(0,0,16,16);
        color.buttonMode = true;
        color.interactive = true;

        color.mousedown = color.touchstart = function() {
            colorsbar.emit('color', clr);
            currentColor.clear();
            currentColor.beginFill(clr);
            currentColor.drawRect(0, 0, 76, 32);
        };

        colorsbar.addChild(color);
    });

    return colorsbar;
};

Colorsbar.prototype = PIXI.DisplayObjectContainer.prototype;
_.mixin(Colorsbar.prototype, Emitter.prototype);

module.exports = Colorsbar;
