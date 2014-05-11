'use strict';

var createPixiGraphics = require('./ngraph/pixiGraphics.js');
var getRandomNiceColor = require('./ngraph/niceColors.js');

var graph = require('ngraph.graph')(),
layout = createLayout(graph);

var graphics = createPixiGraphics(graph, layout);

// First, let's initialize a custom data structure to help us
// store custom information for rendering (like node color, width, etc.)
graphics.createNodeUI(function (node) {
    return {
      width: 2 + Math.random() * 20,
      color: getRandomNiceColor()
  };
}).createLinkUI(function (link) {
    return {
      color: getRandomNiceColor()
  };
});

// Second, let's tell graphics how we actually want to render each node and link:
graphics.renderNode(function (node, ctx) {
    ctx.lineStyle(0);
    ctx.beginFill(node.color);
    var x = node.pos.x - node.width/2,
    y = node.pos.y - node.width/2;

    ctx.drawRect(x, y, node.width, node.width);
}).renderLink(function (link, ctx) {
    ctx.lineStyle(1, link.color);
    ctx.moveTo(link.from.x, link.from.y);
    ctx.lineTo(link.to.x, link.to.y);
});

// Listen to mouse events and update graph acoordingly:
var bindGlobalInput = require('./ngraph/globalInput.js');
bindGlobalInput(graphics, layout);

// begin graph animation (add/remove nodes):
require('./ngraph/fetchData.js')(graph);

// begin frame rendering loop:
window.requestAnimFrame(renderFrame);

function renderFrame() {
    graphics.renderFrame();
    window.requestAnimFrame(renderFrame);
}

function createLayout(graph) {
    var layout = require('ngraph.forcelayout'),
    physics = require('ngraph.physics.simulator');

    return layout(graph, physics({
        springLength: 30,
        springCoeff: 0.0001,
        gravity: -0.4,
        theta: 0.8,
        dragCoeff: 0.02,
        timeStep : 20
    }));
}
