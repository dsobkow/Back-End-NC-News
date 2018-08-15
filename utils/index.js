
const { User, Article } = require('../models/index.js');

exports.generateUserLookup = (userDocs) => {
    return userDocs.reduce((acc, user) => {
        acc[user.username] = user._id;
        return acc;
    }, {})
}

exports.generateTopicLookup = (topicDocs) => {
    return topicDocs.reduce((acc, topic) => {
        acc[topic.slug] = topic.title;
        return acc;
    }, {})
}

const findUser = (param) => {
      return User.findOne({ username: param })
      .then(user => {
          return user._id
      })
      }

const findArticle = (param) => {
    return Article.findOne({ title: param })
    .then(article => {
        return article._id
    })
}

exports.formatArticleData = (articleData) => {
    return Promise.all(articleData.map(article => {
        return findUser(article.created_by)
        .then(created_by => {
            return {
                ...article,
                created_by,
                belongs_to: article.topic
            }
        })
        .catch(console.log)
    }))
}

exports.formatCommentData = (commentData) => {
    return Promise.all(commentData.map(comment => {
       return Promise.all([findArticle(comment.belongs_to), findUser(comment.created_by)])
        .then(([belongs_to, created_by]) => {
            return {
                ...comment,
                belongs_to,
                created_by
            }
        })
        .catch(console.log)
    }))
}