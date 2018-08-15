const Article = require('../models/Article');
const Comment = require('../models/Comment');
const { isEqual } = require('lodash');

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
    Article.findOne({ _id: req.params.article_id })
        .then(article => {
            if (article == null) next({ status: 400, message: 'Invalid article ID' })
            else res.status(200).send({ article })
        })
        .catch(err => {
            next({ status: 400, message: 'Invalid article ID' })
        })
}

exports.getCommentsForArticle = (req, res, next) => {
    Article.findOne({ _id: req.params.article_id })
        .then(article => {
            if (article == null) next({ status: 400, message: 'Invalid article ID' })
            else Comment.find({ belongs_to: req.params.article_id })
                .then(comments => {
                    if (comments.length === 0) next({ status: 404, message: 'Article has no comments' })
                    else res.status(200).send({ comments })
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
    if (isEqual(Object.keys(req.body), ['body', 'created_by'])) {
        Article.findOne({ _id: req.params.article_id })
            .then(article => {
                if (article === null) next({ status: 400, message: 'Invalid article ID' })
                else {
                  const params = {
                      body: req.body.body,
                      created_by: req.body.created_by,
                      belongs_to: req.params.article_id
                  }
                 return Comment.create(params)
                  .then(comment_added => {
                    res.status(201).send({ comment_added })
                  })
                  .catch(err => {
                      next(err)
                  })
                }
            })
            .catch(err => {
                next({ status: 400, message: 'Invalid article ID' })
            })
    } else next({ status: 400, message: 'Comment body and created_by are required' })
}