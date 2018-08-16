const Comment = require('../models/Comment');

exports.voteForComment = (req, res, next) => {
    let voteParams = {};
    if (req.query.vote === 'up') voteParams = { $inc: { votes: 1 } };
    else if (req.query.vote === 'down') voteParams = { $inc: { votes: -1 } };
    else next({ status: 400, message: "Invalid query" });
    Comment.findByIdAndUpdate(req.params.comment_id, voteParams, { new: true })
        .then(votes_updated => {
            if (votes_updated === null) next({ status: 404, message: 'Comment not found' });
            else res.status(201).send({ votes_updated })
        })
        .catch(err => {
            next({ status: 400, message: 'Invalid comment ID' })
        })
}

exports.deleteComment = (req, res, next) => {
    Comment.findByIdAndRemove(req.params.comment_id)
    .then( comment_deleted => {
        if (comment_deleted === null) next({status: 404, message: 'Comment not found'})
        else res.status(201).send({ comment_deleted })
    })
    .catch(err => {
        if (err.name === 'CastError') next({status: 400, message: 'Invalid comment ID'});
        else next(err);
    })
}