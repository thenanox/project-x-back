'use strict';

//Setting up route
angular.module('cards').config(['$stateProvider',
	function($stateProvider) {
		// Cards state routing
		$stateProvider.
		state('listCards', {
			url: '/cards',
			templateUrl: 'modules/cards/views/list-cards.client.view.html'
		}).
		state('createCard', {
			url: '/cards/create',
			templateUrl: 'modules/cards/views/create-card.client.view.html'
		}).
		state('viewCard', {
			url: '/cards/:cardId',
			templateUrl: 'modules/cards/views/view-card.client.view.html'
		}).
		state('editCard', {
			url: '/cards/:cardId/edit',
			templateUrl: 'modules/cards/views/edit-card.client.view.html'
		});
	}
]);