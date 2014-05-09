'use strict';

var PIXI = require('pixi.js/bin/pixi.dev.js');
var _ = require('lodash');

module.exports = function (target) {
    var docDrag = new PIXI.DisplayObjectContainer();

    var graphics = new PIXI.Graphics();

    var container = new PIXI.DisplayObjectContainer();
    docDrag.addChild(container);
    docDrag.addChild(graphics);

    docDrag.interactive = true;
    docDrag.buttonMode = true;
    docDrag.hitArea = new PIXI.Rectangle(0, 0, window.innerWidth, window.innerHeight);

    docDrag.realPosition = { x: 0, y: 0 };

    docDrag.quadrant = function () {
        this.quadrant.x = Math.round( this.realPosition.x / 100 );
        this.quadrant.y = Math.round( this.realPosition.y / 100 );

        return this.quadrant.x.toString(16) + ' : ' + this.quadrant.y.toString(16);
    };

    var lastPoint;

    docDrag.mousedown = docDrag.touchstart = function(data) {
        data.originalEvent.preventDefault();

        this.data = data;
        this.dragging = true;

        this.lastPosition = {
            x: this.data.getLocalPosition(target).x * target.scale.x,
            y: this.data.getLocalPosition(target).y * target.scale.y
        };

        this.downPosition = {
            x: this.data.getLocalPosition(target).x * target.scale.x,
            y: this.data.getLocalPosition(target).y * target.scale.y
        };

        lastPoint = this.downPosition;

    };

    docDrag.toGlobal = function (p) {
        var g = {
            x: p.x - this.realPosition.x,
            y: p.y - this.realPosition.y
        };
        console.log(this.realPosition, p);
        return g;
    };

    docDrag.draw = _.throttle(function (p) {
        if (!lastPoint) { return; }
        var pg = this.toGlobal(p);
        var lg = this.toGlobal(lastPoint);
        graphics.lineStyle(2, docDrag.color, 1);
        graphics.moveTo(lg.x, lg.y);
        graphics.lineTo(pg.x, pg.y);
        graphics.endFill();

        lastPoint = p;
    }.bind(docDrag), 50, {
        'leading': true,
        'trailing': true
    });

    // set the events for when the mouse is released or a touch is released
    docDrag.mouseup = docDrag.mouseupoutside = docDrag.touchend = docDrag.touchendoutside = function() {
        this.dragging = false;
        this.data = null;

        this.realPosition.x += this.lastPosition.x - this.downPosition.x;
        this.realPosition.y += this.lastPosition.y - this.downPosition.y;

        lastPoint = undefined;
    };

    // set the callbacks for when the mouse or a touch moves
    docDrag.mousemove = docDrag.touchmove = function() {
        if (!this.dragging) { return; }

        if (this.drawing) {
            this.draw(this.data.getLocalPosition(this.parent));
        } else {
            var newPosition = this.data.getLocalPosition(this.parent);

            var dx = this.lastPosition.x - newPosition.x;
            var dy = this.lastPosition.y - newPosition.y;

            target.tilePosition.x -= dx;
            target.tilePosition.y -= dy;

            graphics.position.x -= dx;
            graphics.position.y -= dy;

            this.lastPosition = newPosition;
        }
    };

    return docDrag;
};
