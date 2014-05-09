'use strict';

var PIXI = require('pixi.js/bin/pixi.dev.js');

module.exports = function () {
    var sidebar = new PIXI.DisplayObjectContainer();

    var brushTexture = PIXI.Texture.fromImage('images/brush.png');
    var brushButton = new PIXI.Sprite(brushTexture);
    brushButton.buttonMode = true;
    brushButton.interactive = true;
    brushButton.anchor.x = 0.5;
    brushButton.anchor.y = 0.5;
    brushButton.scale.x = 0.25;
    brushButton.scale.y = 0.25;
    brushButton.position.x = 0;
    brushButton.position.y = 0;
    brushButton.alpha = 0.5;

    brushButton.mousedown = brushButton.touchstart = function() {
        sidebar.mode = 'brush';
        moveButton.alpha = 0.5;
        this.alpha = 1;
    };

    var moveTexture = PIXI.Texture.fromImage('images/move.png');
    var moveButton = new PIXI.Sprite(moveTexture);
    moveButton.buttonMode = true;
    moveButton.interactive = true;
    moveButton.anchor.x = 0.5;
    moveButton.anchor.y = 0.5;
    moveButton.scale.x = 1;
    moveButton.scale.y = 1;
    moveButton.position.x = 40;
    moveButton.position.y = 0;
    moveButton.alpha = 0.5;

    moveButton.mousedown = brushButton.touchstart = function() {
        sidebar.mode = 'move';
        brushButton.alpha = 0.5;
        this.alpha = 1;
    };

    sidebar.addChild(brushButton);
    sidebar.addChild(moveButton);

    return sidebar;
};
