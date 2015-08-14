'use strict';

// Cards controller
angular.module('cards').controller('CardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cards',
	function($scope, $stateParams, $location, Authentication, Cards) {
		$scope.authentication = Authentication;

		// Create new Card
		$scope.create = function() {
			// Create new Card object
			var card = new Cards ({
				waitlist: 123,
				platform: 'PC',
				slots: 2,
				creator: 'John Doe',
				description: this.name,
				game: this.name
			});

			// Redirect after save
			card.$save(function(response) {
				$location.path('cards/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Card
		$scope.remove = function(card) {
			if ( card ) { 
				card.$remove();

				for (var i in $scope.cards) {
					if ($scope.cards [i] === card) {
						$scope.cards.splice(i, 1);
					}
				}
			} else {
				$scope.card.$remove(function() {
					$location.path('cards');
				});
			}
		};

		// Update existing Card
		$scope.update = function() {
			var card = $scope.card;

			card.$update(function() {
				$location.path('cards/' + card._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Cards
		$scope.find = function() {
			$scope.cards = Cards.query();
		};

		// Find existing Card
		$scope.findOne = function() {
			$scope.card = Cards.get({ 
				cardId: $stateParams.cardId
			});
		};
	}
]);