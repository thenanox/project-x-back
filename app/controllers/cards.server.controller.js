'use strict';

/**
 * Module dependencies.
 */
var errorHandler = require('./errors.server.controller'),
	Card = require('../models/card.server.model.js'),
	_ = require('lodash');

/**
 * Create a Card
 */
exports.create = function(req, res) {
	var card = new Card(req.body);
	card.user = req.user;

	card.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(card);
		}
	});
};

/**
 * Show the current Card
 */
exports.read = function(req, res) {
	res.jsonp(req.card);
};

/**
 * Update a Card
 */
exports.update = function(req, res) {
	var card = req.card ;

	card = _.extend(card , req.body);

	card.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(card);
		}
	});
};

/**
 * Delete an Card
 */
exports.delete = function(req, res) {
	var card = req.card ;

	card.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(card);
		}
	});
};

/**
 * List of Cards
 */
exports.list = function(req, res) { 
	Card.find().sort('-created').populate('user', 'displayName').exec(function(err, cards) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cards);
		}
	});
};

/**
 * Card middleware
 */
exports.cardByID = function(req, res, next, id) { 
	Card.findById(id).populate('user', 'displayName').exec(function(err, card) {
		if (err) return next(err);
		if (! card) return next(new Error('Failed to load Card ' + id));
		req.card = card ;
		next();
	});
};

/**
 * Card authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.card.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
