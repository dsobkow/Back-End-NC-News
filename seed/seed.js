const mongoose = require('mongoose');
const { User, Topic, Article, Comment } = require('../models/index.js');
const { formatArticleData, formatCommentData } = require('../utils/index.js');

const seedDB = ({articleData, commentData, topicData, userData }) => {
    return mongoose.connection.dropDatabase()
    .then(() => {
        return Promise.all([Topic.insertMany(topicData), User.insertMany(userData)])
    })
    .then(([topicDocs, userDocs]) => {
        return Promise.all([formatArticleData(articleData), topicDocs, userDocs])
    })
    .then(([formattedArticles, topicDocs, userDocs]) => {
       return Promise.all([Article.insertMany(formattedArticles), topicDocs, userDocs])
    })
    .then(([articleDocs, topicDocs, userDocs]) => {
        return Promise.all([articleDocs, formatCommentData(commentData), topicDocs, userDocs])
    })
    .then(([articleDocs, formattedComments, topicDocs, userDocs]) => {
        return Promise.all([articleDocs, Comment.insertMany(formattedComments), topicDocs, userDocs])
    })
    .then(([articleDocs, commentDocs, topicDocs, userDocs])=> {
        //console.log(`${articleDocs.length} articles, ${commentDocs.length} comments, ${topicDocs.length} topics and ${userDocs.length} users added`)
        return Promise.all([articleDocs, commentDocs, topicDocs, userDocs])
    })
    .catch(console.log)
}

module.exports = seedDB;