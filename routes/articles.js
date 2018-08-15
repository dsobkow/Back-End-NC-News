const articlesRouter = require('express').Router();
const { getArticles, getArticleById, getCommentsForArticle, addCommentToArticle } = require('../controllers/articles');

articlesRouter.route('/')
.get(getArticles);

articlesRouter.route('/:article_id')
.get(getArticleById);

articlesRouter.route('/:article_id/comments')
.get(getCommentsForArticle)
.post(addCommentToArticle);

module.exports = articlesRouter;