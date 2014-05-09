'use strict';

var PIXI = require('pixi.js/bin/pixi.dev.js');
var _ = require('lodash');
var Emitter = require('wildemitter');

var DocDrag = function () {
    PIXI.DisplayObjectContainer.call(this);
    Emitter.call(this);

    this.interactive = true;
    this.buttonMode = true;
    this.hitArea = new PIXI.Rectangle(0, 0, window.innerWidth, window.innerHeight);

    this.mousedown = this.touchstart = function(data) {
        data.originalEvent.preventDefault();
        this.data = data;
        this.lastPosition = this.data.getLocalPosition(this.parent);
        lastPoint = this.lastPosition;
        this.dragging = true;
    };

    // set the events for when the mouse is released or a touch is released
    this.mouseup = this.mouseupoutside = this.touchend = this.touchendoutside = function() {
        this.dragging = false;
        this.data = null;
        lastPoint = undefined;
    };

    var lastPoint;

    this.draw = _.throttle(function (p) {
        if (!lastPoint) { return; }
        this.emit('line', lastPoint, p);
        lastPoint = p;
    }.bind(this), 50, {
        'leading': true,
        'trailing': true
    });

    // set the callbacks for when the mouse or a touch moves
    this.mousemove = this.touchmove = function() {
        if (!this.dragging) { return; }

        var newPosition = this.data.getLocalPosition(this.parent);
        this.draw(newPosition);
        this.lastPosition = this.lastPosition || newPosition;

        var dx = this.lastPosition.x - newPosition.x;
        var dy = this.lastPosition.y - newPosition.y;

        this.emit('drag', { x: dx, y: dy });

        this.lastPosition = newPosition;
    }.bind(this);
};

DocDrag.prototype = PIXI.DisplayObjectContainer.prototype;
_.mixin(DocDrag.prototype, Emitter.prototype);

module.exports = DocDrag;
