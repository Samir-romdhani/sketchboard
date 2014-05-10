'use strict';

var Emitter = require('wildemitter');
var PIXI = require('pixi.js/bin/pixi.dev.js');

var Renderer = function () {
    Emitter.call(this);
    this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);

    this.renderer.view.style.position = 'absolute';
    this.renderer.view.style.top = '0px';
    this.renderer.view.style.left = '0px';
    document.body.appendChild(this.renderer.view);

    var self = this;
    function animate() {
        self.emit('frame');
        window.requestAnimFrame(animate);
    }

    window.requestAnimFrame(animate);
};

Renderer.prototype = Emitter.prototype;

module.exports = Renderer;
