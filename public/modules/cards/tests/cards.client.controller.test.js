'use strict';

(function() {
	// Cards Controller Spec
	describe('Cards Controller Tests', function() {
		// Initialize global variables
		var CardsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Cards controller.
			CardsController = $controller('CardsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Card object fetched from XHR', inject(function(Cards) {
			// Create sample Card using the Cards service
			var sampleCard = new Cards({
				name: 'New Card'
			});

			// Create a sample Cards array that includes the new Card
			var sampleCards = [sampleCard];

			// Set GET response
			$httpBackend.expectGET('cards').respond(sampleCards);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cards).toEqualData(sampleCards);
		}));

		it('$scope.findOne() should create an array with one Card object fetched from XHR using a cardId URL parameter', inject(function(Cards) {
			// Define a sample Card object
			var sampleCard = new Cards({
				name: 'New Card'
			});

			// Set the URL parameter
			$stateParams.cardId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/cards\/([0-9a-fA-F]{24})$/).respond(sampleCard);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.card).toEqualData(sampleCard);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Cards) {
			// Create a sample Card object
			var sampleCardPostData = new Cards({
				name: 'New Card'
			});

			// Create a sample Card response
			var sampleCardResponse = new Cards({
				_id: '525cf20451979dea2c000001',
				name: 'New Card'
			});

			// Fixture mock form input values
			scope.name = 'New Card';

			// Set POST response
			$httpBackend.expectPOST('cards', sampleCardPostData).respond(sampleCardResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Card was created
			expect($location.path()).toBe('/cards/' + sampleCardResponse._id);
		}));

		it('$scope.update() should update a valid Card', inject(function(Cards) {
			// Define a sample Card put data
			var sampleCardPutData = new Cards({
				_id: '525cf20451979dea2c000001',
				name: 'New Card'
			});

			// Mock Card in scope
			scope.card = sampleCardPutData;

			// Set PUT response
			$httpBackend.expectPUT(/cards\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/cards/' + sampleCardPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid cardId and remove the Card from the scope', inject(function(Cards) {
			// Create new Card object
			var sampleCard = new Cards({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Cards array and include the Card
			scope.cards = [sampleCard];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/cards\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCard);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.cards.length).toBe(0);
		}));
	});
}());