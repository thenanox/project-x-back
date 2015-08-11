'use strict';

/**
 * Module dependencies.
 */
var	thinky = require('../utils/thinky'),
	type = thinky.type,
	r = thinky.r,
	User = require('./user.server.model.js');

/**
 * Article Schema
 */
var Article = thinky.createModel('Article', {
	created: type.date().default(r.now),
	title: type.string(),
	content: type.string(),
	userId: type.string(),
},{init:true});

User.hasMany(Article, 'article', 'id', 'userId');
Article.belongsTo(User, 'user', 'userid', 'id');

module.exports = Article;
