const Topic = require('../models/Topic');
const Article = require('../models/Article');
const User = require('../models/User');

exports.getTopics = (req, res, next) => {
    Topic.find()
        .then(topics => {
            res.status(200).send({ topics })
        })
}

exports.getArticlesByTopic = (req, res, next) => {
    Article.find({ belongs_to: req.params.topic_slug })
        .then(articles => {
            if (articles.length === 0) next({ status: 400, message: 'Invalid topic' })
            else res.status(200).send({ articles })
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
                User.find()
                    .then(users => {
                        const params = {
                            belongs_to: req.params.topic_slug,
                            title: req.body.title,
                            body: req.body.body,
                            created_by: users[0]._id
                        }
                        return Article.create(params)
                            .then(article_added => {
                                res.status(201).send({ article_added })
                            })
                            .catch(err => {
                                next({status:400, message: err.message})
                            })
                    })
            }
        })
}