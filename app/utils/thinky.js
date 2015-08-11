// file: util/thinky.js
var config = require('../../config/config'),
    thinky = require('thinky')(config.db);

module.exports = thinky;
