'use strict';

var PSON = require('pson'),
    pson = new PSON.StaticPair(),
    _ = require('lodash');

module.exports = function (graph) {
    var socket = new window.WebSocket('ws://' + window.location.host + '/map');
    socket.binaryType = 'arraybuffer';

    socket.onopen = function () {
        console.log('Opened WebSocket to /map');
    };

    var nodes = {};

    socket.onmessage = function (e) {
        var msg = pson.decode(e.data);

        var removedNodes = _.difference(_.keys(nodes), _.keys(msg));
        var addedNodes = _.difference(_.keys(msg), _.keys(nodes));

        graph.beginUpdate();

        _.forEach(removedNodes, function (id) {
            graph.removeNode(id);
        });

        _.forEach(addedNodes, function (id) {
            graph.addNode(id);
        });

        graph.endUpdate();

        nodes = msg;
    };
};
