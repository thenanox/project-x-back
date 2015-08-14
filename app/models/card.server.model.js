'use strict';

/**
 * Module dependencies.
 */
var	thinky = require('../utils/thinky'),
	type = thinky.type,
	r = thinky.r;

/**
 * Card Schema
 */
var Card = thinky.createModel('cards', {
	time: type.date().default(r.now),
	waitlist: type.number(),
	platform: type.string(),
	slots: type.number(),
	creator: type.string(),
	description: type.string(),
	game: type.string()
});

module.exports = Card;