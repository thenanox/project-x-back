'use strict';

/**
 * Module dependencies.
 */
var	thinky = require('../utils/thinky'),
	type = thinky.type,
	r = thinky.r,
	crypto = require('crypto');

/**
 * User Schema
 */
var User = thinky.createModel('User',{
	firstName: type.string(),
	lastName: type.string(),
	displayName: type.string(),
	email: type.string().email(),
	username: type.string(),
	password: type.string(),
	salt: type.string(),
	provider: type.string(),
	providerData: {},
	additionalProvidersData: {},
	roles: type.string().enum(['user','admin']),
	updated: type.date(),
	created: type.date().default(r.now),
	resetPasswordToken: type.string(),
	resetPasswordExpires: type.date(),
	id: type.string()
},{init : true});

/**
 * Create instance method for hashing a password
 */
User.define.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
User.define.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

/*User.pre('save', function(next) {
    if (this.password && this.password.length > 6) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }

    next();
});*/

/**
 * Find possible not used username
 */
User.defineStatic.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.get({
        username: possibleUsername
    }, function(err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

module.exports = User;
