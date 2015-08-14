'use strict';
/**
 * Module dependencies.
 */
var errorHandler = require('./errors.server.controller'), Article = require('../models/article.server.model.js'), _ = require('lodash');
/**
 * Create a article
 */
exports.create = function (req, res) {
    var article = new Article(req.body);
    article.user = req.user;
    article.saveAll(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(article);
        }
    });
};
/**
 * Show the current article
 */
exports.read = function (req, res) {
    res.json(req.article);
};
/**
 * Update a article
 */
exports.update = function (req, res) {
    var article = req.article;
    article = _.extend(article, req.body);
    article.saveAll(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(article);
        }
    });
};
/**
 * Delete an article
 */
exports.delete = function (req, res) {
    var article = req.article;
    article.delete(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(article);
        }
    });
};
/**
 * List of Articles
 */
exports.list = function (req, res) {
    Article.get().sort('-created').populate('user', 'displayName').exec(function (err, articles) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(articles);
        }
    });
};
/**
 * Article middleware
 */
exports.articleByID = function (req, res, next, id) {
    Article.get(id).populate('user', 'displayName').exec(function (err, article) {
        if (err)
            return next(err);
        if (!article)
            return next(new Error('Failed to load article ' + id));
        req.article = article;
        next();
    });
};
/**
 * Article authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.article.user.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};

//# sourceMappingURL=../controllers/articles.server.controller.js.map