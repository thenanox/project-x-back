'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Card = mongoose.model('Card'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, card;

/**
 * Card routes tests
 */
describe('Card CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Card
		user.save(function() {
			card = {
				name: 'Card Name'
			};

			done();
		});
	});

	it('should be able to save Card instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Card
				agent.post('/cards')
					.send(card)
					.expect(200)
					.end(function(cardSaveErr, cardSaveRes) {
						// Handle Card save error
						if (cardSaveErr) done(cardSaveErr);

						// Get a list of Cards
						agent.get('/cards')
							.end(function(cardsGetErr, cardsGetRes) {
								// Handle Card save error
								if (cardsGetErr) done(cardsGetErr);

								// Get Cards list
								var cards = cardsGetRes.body;

								// Set assertions
								(cards[0].user._id).should.equal(userId);
								(cards[0].name).should.match('Card Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Card instance if not logged in', function(done) {
		agent.post('/cards')
			.send(card)
			.expect(401)
			.end(function(cardSaveErr, cardSaveRes) {
				// Call the assertion callback
				done(cardSaveErr);
			});
	});

	it('should not be able to save Card instance if no name is provided', function(done) {
		// Invalidate name field
		card.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Card
				agent.post('/cards')
					.send(card)
					.expect(400)
					.end(function(cardSaveErr, cardSaveRes) {
						// Set message assertion
						(cardSaveRes.body.message).should.match('Please fill Card name');
						
						// Handle Card save error
						done(cardSaveErr);
					});
			});
	});

	it('should be able to update Card instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Card
				agent.post('/cards')
					.send(card)
					.expect(200)
					.end(function(cardSaveErr, cardSaveRes) {
						// Handle Card save error
						if (cardSaveErr) done(cardSaveErr);

						// Update Card name
						card.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Card
						agent.put('/cards/' + cardSaveRes.body._id)
							.send(card)
							.expect(200)
							.end(function(cardUpdateErr, cardUpdateRes) {
								// Handle Card update error
								if (cardUpdateErr) done(cardUpdateErr);

								// Set assertions
								(cardUpdateRes.body._id).should.equal(cardSaveRes.body._id);
								(cardUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Cards if not signed in', function(done) {
		// Create new Card model instance
		var cardObj = new Card(card);

		// Save the Card
		cardObj.save(function() {
			// Request Cards
			request(app).get('/cards')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Card if not signed in', function(done) {
		// Create new Card model instance
		var cardObj = new Card(card);

		// Save the Card
		cardObj.save(function() {
			request(app).get('/cards/' + cardObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', card.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Card instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Card
				agent.post('/cards')
					.send(card)
					.expect(200)
					.end(function(cardSaveErr, cardSaveRes) {
						// Handle Card save error
						if (cardSaveErr) done(cardSaveErr);

						// Delete existing Card
						agent.delete('/cards/' + cardSaveRes.body._id)
							.send(card)
							.expect(200)
							.end(function(cardDeleteErr, cardDeleteRes) {
								// Handle Card error error
								if (cardDeleteErr) done(cardDeleteErr);

								// Set assertions
								(cardDeleteRes.body._id).should.equal(cardSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Card instance if not signed in', function(done) {
		// Set Card user 
		card.user = user;

		// Create new Card model instance
		var cardObj = new Card(card);

		// Save the Card
		cardObj.save(function() {
			// Try deleting Card
			request(app).delete('/cards/' + cardObj._id)
			.expect(401)
			.end(function(cardDeleteErr, cardDeleteRes) {
				// Set message assertion
				(cardDeleteRes.body.message).should.match('User is not logged in');

				// Handle Card error error
				done(cardDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Card.remove().exec();
		done();
	});
});