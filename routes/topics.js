const topicsRouter = require('express').Router();
const { getTopics, getArticlesByTopic, addArticletoTopic } = require('../controllers/topics');

topicsRouter.route('/')
.get(getTopics);

topicsRouter.route('/:topic_slug/articles')
.get(getArticlesByTopic)
.post(addArticletoTopic);

module.exports = topicsRouter;