'use strict';

//Cards service used to communicate Cards REST endpoints
angular.module('cards').factory('Cards', ['$resource',
	function($resource) {
		return $resource('cards/:cardId', { cardId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);