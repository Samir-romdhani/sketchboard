'use strict';

var PIXI = require('pixi.js');

module.exports = function (target) {
    var docDrag = new PIXI.DisplayObjectContainer();

    docDrag.interactive = true;
    docDrag.buttonMode = true;
    docDrag.hitArea = new PIXI.Rectangle(0, 0, window.innerWidth, window.innerHeight);

    docDrag.realPosition = { x: 0, y: 0 };

    docDrag.quadrant = function () {
        this.quadrant.x = Math.round( this.realPosition.x / 100 );
        this.quadrant.y = Math.round( this.realPosition.y/ 100 );

        return this.quadrant.x.toString(16) + ' : ' + this.quadrant.y.toString(16);
    };

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

    };

    // set the events for when the mouse is released or a touch is released
    docDrag.mouseup = docDrag.mouseupoutside = docDrag.touchend = docDrag.touchendoutside = function() {
        this.dragging = false;
        this.data = null;

        this.realPosition.x += this.lastPosition.x - this.downPosition.x;
        this.realPosition.y += this.lastPosition.y - this.downPosition.y;
    };

    // set the callbacks for when the mouse or a touch moves
    docDrag.mousemove = docDrag.touchmove = function() {
        if(this.dragging) {
            var newPosition = this.data.getLocalPosition(this.parent);

            var dx = this.lastPosition.x - newPosition.x;
            var dy = this.lastPosition.y - newPosition.y;

            target.tilePosition.x -= dx;
            target.tilePosition.y -= dy;

            this.lastPosition = newPosition;
        }
    };

    return docDrag;
};
