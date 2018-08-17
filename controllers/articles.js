const Article = require('../models/Article');
const Comment = require('../models/Comment');

exports.getArticles = (req, res, next) => {
    Article.find()
        .then(articles => {
            res.status(200).send({ articles })
        })
        .catch(err => {
            next(err)
        })
}

exports.getArticleById = (req, res, next) => {
    Comment.countDocuments({ belongs_to: req.params.article_id })
        .then(count => {
            Article.findByIdAndUpdate(req.params.article_id, { comments: count }, { new: true })
                .then(article => {
                    if (article === null) next({ status: 404, message: 'Article not found' })
                    else res.status(200).send({ article })
                })
                .catch(err => {
                    next({ status: 400, message: 'Invalid article ID' })
                })
        })
        .catch(err => {
            next({ status: 400, message: 'Invalid article ID' })
        })
}

exports.getCommentsForArticle = (req, res, next) => {
    Article.findById(req.params.article_id)
        .then(article => {
            if (article === null) next({ status: 404, message: 'Article not found' })
            else Comment.find({ belongs_to: req.params.article_id })
                .then(comments => {
                    if (comments.length === 0) next({ status: 404, message: 'Article has no comments' })
                    else return Comment.populate(comments, 'created_by')
                        .then(comments => {
                            res.status(200).send({ comments })
                        })
                })
                .catch(err => {
                    next({ status: 400, message: 'Invalid article ID' })
                })
        })
        .catch(err => {
            next({ status: 400, message: 'Invalid article ID' })
        })
}

exports.addCommentToArticle = (req, res, next) => {
    Article.findById(req.params.article_id)
        .then(article => {
            if (article === null) next({ status: 404, message: 'Article not found' })
            else {
                const params = {
                    body: req.body.body,
                    created_by: req.body.created_by,
                    belongs_to: req.params.article_id
                }
                return Comment.create(params)
                    .then(comment_added => {
                        return Comment.populate(comment_added, 'created_by')
                    })
                    .then(comment_added => {
                        if (comment_added.created_by === null) next({ status: 404, message: 'User ID not found' })
                        else res.status(201).send({ comment_added })
                    })
                    .catch(err => {
                        if (err.name === 'ValidationError') next({ status: 400, message: err.message })
                        else next(err)
                    })
            }
        })
        .catch(err => {
            next({ status: 400, message: 'Invalid article ID' })
        })
}

exports.voteForArticle = (req, res, next) => {
    let voteParams = {};
    if (req.query.vote === 'up') voteParams = { $inc: { votes: 1 } };
    else if (req.query.vote === 'down') voteParams = { $inc: { votes: -1 } };
    else next({ status: 400, message: "Invalid query" });
    Article.findByIdAndUpdate(req.params.article_id, voteParams, { new: true })
        .then(votes_updated => {
            if (votes_updated === null) next({ status: 404, message: 'Article not found' });
            else res.status(201).send({ votes_updated })
        })
        .catch(err => {
            next({ status: 400, message: 'Invalid article ID' })
        })
}
