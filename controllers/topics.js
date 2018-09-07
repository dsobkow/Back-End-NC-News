const Topic = require('../models/Topic');
const Article = require('../models/Article');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { includes } = require('lodash');

exports.getTopics = (req, res, next) => {
    Topic.find()
        .then(topics => {
            res.status(200).send({ topics })
        })
}

exports.getArticlesByTopic = (req, res, next) => {
    Article.find({ belongs_to: req.params.topic_slug })
        .populate('created_by')
        .lean()
        .then(articles => {
            const commentCount = articles.map(article => {
                return Comment.countDocuments({ belongs_to: article._id })
            })
            return Promise.all([articles, ...commentCount])
        })
        .then(([articles, ...commentCount]) => {
            const articlesWithComments = articles.map((article, index) => {
                return {
                    ...article,
                    comments: commentCount[index]
                }
            })
            if (articlesWithComments.length === 0) next({ status: 400, message: 'Invalid topic' })
            else res.status(200).send({ articlesWithComments })
        })
        .catch(err => {
            next(err)
        })
}

exports.addArticletoTopic = (req, res, next) => {
    Topic.findOne({ slug: req.params.topic_slug })
        .then(topic => {
            if (topic === null) next({ status: 400, message: 'Invalid topic' })
            else {
                const params = {
                    belongs_to: req.params.topic_slug,
                    title: req.body.title,
                    body: req.body.body,
                    created_by: req.body.created_by
                }
                return Article.create(params)
                    .then(comment_added => {
                        return Comment.populate(comment_added, 'created_by')
                    })
                    .then(article_added => {
                        res.status(201).send({ article_added })
                    })
                    .catch(err => {
                        next({ status: 400, message: err.message })
                    })
            }
        })
}