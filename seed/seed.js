const mongoose = require('mongoose');
const { User, Topic, Article, Comment } = require('../models/index.js');
const { formatArticleData, formatCommentData } = require('../utils/index.js');

const seedDB = ({ topicData, userData, articleData, commentData }) => {
    return mongoose.connection.dropDatabase()
    .then(() => {
        return Promise.all([User.insertMany(userData), Topic.insertMany(topicData)])
    })
    .then(([userDocs, topicDocs]) => {
        console.log(userDocs)
        console.log(`${userDocs.length} users and ${topicDocs.length} topics added`)
        return formatArticleData(articleData)
    })
    .then(formattedArticles => {
       return Article.insertMany(formattedArticles)
    })
    .then((articleDocs) => {
        console.log(articleDocs)
        console.log(`${articleDocs.length} articles added`)
        return formatCommentData(commentData)
    })
    .then((formattedComments) => {
        return Comment.insertMany(formattedComments)
    })
    .then(commentDocs => {
        console.log(`${commentDocs.length} comments added`)
    })
    .catch(console.log)
}

module.exports = seedDB;