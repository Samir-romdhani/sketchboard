'use strict';

var grid = require('grid');

module.exports = function Grid() {
    return grid.apply(grid, arguments);
};
