'use strict';

var PIXI = require('pixi.js/bin/pixi.dev.js');
var _ = require('lodash');
var Emitter = require('wildemitter');

var Sidebar = function () {
    PIXI.DisplayObjectContainer.call(this);
    Emitter.call(this);
    var sidebar = this;

    var brushTexture = PIXI.Texture.fromImage('images/brush.png');
    var brushButton = new PIXI.Sprite(brushTexture);
    brushButton.buttonMode = true;
    brushButton.interactive = true;
    brushButton.scale.x = 0.25;
    brushButton.scale.y = 0.25;
    brushButton.position.x = 0;
    brushButton.position.y = 0;
    brushButton.alpha = 0.5;

    brushButton.mousedown = brushButton.touchstart = function() {
        sidebar.emit('brush-button');
        moveButton.alpha = 0.5;
        this.alpha = 1;
    };

    var moveTexture = PIXI.Texture.fromImage('images/move.png');
    var moveButton = new PIXI.Sprite(moveTexture);
    moveButton.buttonMode = true;
    moveButton.interactive = true;
    moveButton.scale.x = 1;
    moveButton.scale.y = 1;
    moveButton.position.x = 40;
    moveButton.position.y = 0;
    moveButton.alpha = 1;

    moveButton.mousedown = brushButton.touchstart = function() {
        sidebar.emit('move-button');
        brushButton.alpha = 0.5;
        this.alpha = 1;
    };

    sidebar.mode = 'move';
    sidebar.addChild(brushButton);
    sidebar.addChild(moveButton);

    return sidebar;
};

_.mixin(Sidebar.prototype, PIXI.DisplayObjectContainer.prototype);
_.mixin(Sidebar.prototype, Emitter.prototype);

module.exports = Sidebar;
