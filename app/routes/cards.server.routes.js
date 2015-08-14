'use strict';

module.exports = function(app) {
	var cards = require('../../app/controllers/cards.server.controller');

	// Cards Routes
	app.route('/cards')
		.get(cards.list)
		.post(cards.create);

	app.route('/cards/:cardId')
		.get(cards.read)
		.put(cards.update)
		.delete(cards.delete);

	// Finish by binding the Card middleware
	app.param('cardId', cards.cardByID);
};
