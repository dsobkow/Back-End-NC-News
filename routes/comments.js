const commentsRouter = require('express').Router();
const { voteForComment, deleteComment } = require('../controllers/comments');

commentsRouter.route('/:comment_id')
.put(voteForComment)
.delete(deleteComment);


module.exports = commentsRouter;