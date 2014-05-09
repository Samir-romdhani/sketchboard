'use strict';

var PIXI = require('pixi.js/bin/pixi.dev.js');
var _ = require('lodash');
var Emitter = require('wildemitter');

var colors = [
    0x000000,
    0x111111,
    0x222222,
    0x333333,
    0x444444,
    0x555555,
    0x666666,
    0x777777,
    0x888888,
    0x999999,
    0xAAAAAA,
    0xBBBBBB,
    0xCCCCCC,
    0xDDDDDD,
    0xEEEEEE,
    0xFFFFFF
];

var Sidebar = function () {
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

_.mixin(Sidebar.prototype, PIXI.DisplayObjectContainer.prototype);
_.mixin(Sidebar.prototype, Emitter.prototype);

module.exports = Sidebar;
