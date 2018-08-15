const apiRouter = require('express').Router();
const topicsRouter = require('./topics');
const articlesRouter = require('./articles');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);

apiRouter.get('/', (req, res, next) => {
    res.send('Welcome to Northcoders News homepage');
  });

module.exports = apiRouter;