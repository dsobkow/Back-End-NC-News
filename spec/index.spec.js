process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const { expect } = require('chai');
const testData = require('../seed/testData/index.js');
const seedDB = require('../seed/seed.js');
const mongoose = require('mongoose');

describe('NORTHCODERS NEWS API /api', () => {

    const invalidId = mongoose.Types.ObjectId();
    let articleDocs, commentDocs, topicDocs, userDocs;
    beforeEach(() => {
        return seedDB(testData).then(docs => {
            articleDocs = docs[0];
            commentDocs = docs[1];
            topicDocs = docs[2];
            userDocs = docs[3];
        });
    });
    after(() => mongoose.disconnect());

    describe('/topics', () => {
        it('GET returns 200 and all topics', () => {
            return request.get('/api/topics')
            .expect(200)
            .then(res => {
                expect(res.body.topics.length).to.equal(2);
                expect(res.body.topics[0].slug).to.equal('mitch');
            });
        });
        it('GET returns 404 and error message for invalid endpoint', () => {
            return request.get('/news')
            .expect(404)
            .then(res => {
                expect(res.body.message).to.equal('Page not found');
            });
        });
        describe('/:topic_slug/articles', () => {
            it('GET returns 200 and all articles for a certain topic', () => {
                return request.get('/api/topics/cats/articles')
                .expect(200)
                .then(res => {
                    expect(res.body.articlesWithComments.length).to.equal(2);
                    expect(res.body.articlesWithComments[1].title).to.equal('UNCOVERED: catspiracy to bring down democracy');
                })
            });
            it('GET returns 400 and error message for invalid topic', () => {
                return request.get('/api/topics/dogs/articles')
                .expect(400)
                .then(res => {
                    expect(res.body.message).to.equal('Invalid topic');
                })
            });
            it('POST returns 201 and article that has been added to selected topic', () => {
                const newArticle = {
                    title: 'If You’re Really Brave, Adopt a Kitten!',
                    body: 'Now if you are in the market for a new feline companion, we have some guidelines that can make this experience unique and wonderful. It will take a little work at first, but the reward for your efforts will be a benefit to you and your cats for many years.'
                }
                return request.post('/api/topics/cats/articles')
                .send(newArticle)
                .expect(201)
                .then(res => {
                    expect(res.body.article_added).to.have.all.keys('votes', '_id', 'belongs_to', 'title', 'body', 'created_by', 'created_at', '__v', 'comments');
                    expect(res.body.article_added.title).to.equal('If You’re Really Brave, Adopt a Kitten!');
                })
            });
            it('POST returns 400 and error message for invalid topic', () => {
                const newArticle = {
                    title: 'If You’re Really Brave, Adopt a Kitten!',
                    body: 'Now if you are in the market for a new feline companion, we have some guidelines that can make this experience unique and wonderful. It will take a little work at first, but the reward for your efforts will be a benefit to you and your cats for many years.'
                }
                return request.post('/api/topics/dogs/articles')
                .send(newArticle)
                .expect(400)
                .then(res => {
                    expect(res.body.message).to.equal('Invalid topic');
                });
            });
            it('POST returns 400 and error message if one of the keys is missing', () => {
                const newArticle = {
                    body: 'Now if you are in the market for a new feline companion, we have some guidelines that can make this experience unique and wonderful. It will take a little work at first, but the reward for your efforts will be a benefit to you and your cats for many years.'
                }
                return request.post('/api/topics/cats/articles')
                .send(newArticle)
                .expect(400)
                .then(res => {
                    expect(res.body.message).to.equal('articles validation failed: title: Article title is required');
                });
            });
        });
    });
    describe('/articles', () => {
        it('GET returns 200 and all articles with comment counts', () => {
            return request.get('/api/articles')
            .expect(200)
            .then(res => {
                expect(res.body.articlesWithComments.length).to.equal(4);
                expect(res.body.articlesWithComments[2].body).to.equal('Well? Think about it.');
                expect(res.body.articlesWithComments[1].comments).to.equal(2);
            });
        });
        describe('/:article_id', () => {
            it('GET returns 200 and a certain article', () => {
                return request.get(`/api/articles/${articleDocs[1]._id}`)
                .expect(200)
                .then(res => {
                    expect(res.body.article.title).to.equal('7 inspirational thought leaders from Manchester UK')
                });
            });
            it('GET returns 400 and error message for invalid article ID', () => {
                return request.get('/api/articles/newarticle')
                .expect(400)
                .then(res => {
                    expect(res.body.message).to.equal('Invalid article ID')
                });
            });
            it('GET returns 404 and error message for article that does not exist', () => {
                return request.get(`/api/articles/${invalidId}`)
                .expect(404)
                .then(res => {
                    expect(res.body.message).to.equal('Article not found')
                });
            });
            it('PUT returns 201 and article with votes incremented by 1', () => {
                return request.put(`/api/articles/${articleDocs[1]._id}?vote=up`)
                .expect(201)
                .then(res => {
                    expect(res.body.votes_updated.votes).to.equal(1)
                });
            });
            it('PUT returns 201 and article with votes decremented by 1', () => {
                return request.put(`/api/articles/${articleDocs[1]._id}?vote=down`)
                .expect(201)
                .then(res => {
                    expect(res.body.votes_updated.votes).to.equal(-1)
                });
            });
            it('PUT returns 400 and error message for invalid query', () => {
                return request.put(`/api/articles/${articleDocs[1]._id}?vote=yes`)
                .expect(400)
                .then(res => {
                   expect(res.body.message).to.equal('Invalid query')
                });
            });
            it('PUT returns 404 and error message for article that does not exist', () => {
                return request.put(`/api/articles/${invalidId}?vote=up`)
                .expect(404)
                .then(res => {
                    expect(res.body.message).to.equal('Article not found')
                });
            });
            it('PUT returns 400 and error message for invalid article ID', () => {
                return request.put(`/api/articles/newarticle?vote=up`)
                .expect(400)
                .then(res => {
                    expect(res.body.message).to.equal('Invalid article ID')
                });
            });
        });
        describe('/:article_id/comments', () => {
            it('GET returns 200 and comments for a certain article', () => {
                return request.get(`/api/articles/${articleDocs[1]._id}/comments`)
                .expect(200)
                .then(res => {
                    expect(res.body.comments.length).to.equal(2);
                });
            });
            it('GET returns 400 and error message for invalid article ID', () => {
                return request.get('/api/articles/newarticle/comments')
                .expect(400)
                .then(res => {
                    expect(res.body.message).to.equal('Invalid article ID')
                });
            });
            it('GET returns 404 and error message for article that does not exist', () => {
                return request.get(`/api/articles/${invalidId}/comments`)
                .expect(404)
                .then(res => {
                    expect(res.body.message).to.equal('Article not found')
                });
            });
            it('POST returns 201 and a comment that has been added to selected article', () => {
                const newComment = {
                    body: 'Great article',
                    created_by: userDocs[1]._id
                }
                return request.post(`/api/articles/${articleDocs[1]._id}/comments`)
                .send(newComment)
                .expect(201)
                .then(res => {
                    expect(res.body.comment_added).to.have.all.keys('votes', '_id', 'body', 'created_by', 'belongs_to', 'created_at', '__v');
                    expect(res.body.comment_added.body).to.equal('Great article');
                });
            });
            it('POST returns 400 and error message for invalid article ID', () => {
                const newComment = {
                    body: 'Great article',
                    created_by: userDocs[1]._id
                }
                return request.post('/api/articles/newarticle/comments')
                .send(newComment)
                .expect(400)
                .then(res => {
                    expect(res.body.message).to.equal('Invalid article ID')
                });
            });
            it('POST returns 404 and error message for article that does not exist', () => {
                const newComment = {
                    body: 'Great article',
                    created_by: userDocs[1]._id
                }
                return request.post(`/api/articles/${invalidId}/comments`)
                .send(newComment)
                .expect(404)
                .then(res => {
                    expect(res.body.message).to.equal('Article not found')
                });
            });
            it('POST returns 400 and error message when comment body is missing', () => {
                const newComment = {
                    created_by: userDocs[1]._id
                }
                return request.post(`/api/articles/${articleDocs[0]._id}/comments`)
                .send(newComment)
                .expect(400)
                .then(res => {
                    expect(res.body.message).to.equal('comments validation failed: body: Comment body is required')
                });
            });
            it('POST returns 404 and error message for user that does not exist', () => {
                const newComment = {
                    body: 'Great article',
                    created_by: invalidId
                }
                return request.post(`/api/articles/${articleDocs[0]._id}/comments`)
                .send(newComment)
                .expect(404)
                .then(res => {
                    expect(res.body.message).to.equal('User ID not found')
                });
            });
            it('POST returns 400 and error message for invalid user ID', () => {
                const newComment = {
                    body: 'Great article',
                    created_by: 'jonny'
                }
                return request.post(`/api/articles/${articleDocs[0]._id}/comments`)
                .send(newComment)
                .expect(400)
                .then(res => {
                    expect(res.body.message).to.equal('comments validation failed: created_by: Cast to ObjectID failed for value "jonny" at path "created_by"')
                });
            });
        });
    });
    describe('/comments', () => {
        describe('/:comment_id', () => {
            it('PUT returns 201 and comment with votes incremented by 1', () => {
                return request.put(`/api/comments/${commentDocs[1]._id}?vote=up`)
                .expect(201)
                .then(res => {
                    expect(res.body.votes_updated.votes).to.equal(20)
                });
            });
            it('PUT returns 201 and comment with votes decremented by 1', () => {
                return request.put(`/api/comments/${commentDocs[1]._id}?vote=down`)
                .expect(201)
                .then(res => {
                    expect(res.body.votes_updated.votes).to.equal(18)
                });
            });
            it('PUT returns 400 and error message for invalid query', () => {
                return request.put(`/api/comments/${commentDocs[1]._id}?vote=yes`)
                .expect(400)
                .then(res => {
                   expect(res.body.message).to.equal('Invalid query')
                });
            });
            it('PUT returns 404 and error message for comment that does not exist', () => {
                return request.put(`/api/comments/${invalidId}?vote=up`)
                .expect(404)
                .then(res => {
                    expect(res.body.message).to.equal('Comment not found')
                });
            });
            it('PUT returns 400 and error message for invalid comment ID', () => {
                return request.put(`/api/comments/newcomment?vote=up`)
                .expect(400)
                .then(res => {
                    expect(res.body.message).to.equal('Invalid comment ID')
                });
            });
            it('DELETE return 201 and removes specified comment from database', () => {
                return request.del(`/api/comments/${commentDocs[1]._id}`)
               .expect(201)
                .then(res => {
                   expect(res.body.comment_deleted.body).to.equal(' I carry a log — yes. Is it funny to you? It is not to me.');
                });
            });
            it('DELETE returns 404 and error message for comment that does not exist', () => {
                return request.del(`/api/comments/${invalidId}`)
               .expect(404)
                .then(res => {
                   expect(res.body.message).to.equal('Comment not found');
                });
            });
            it('DELETE returns 400 and error message for invalid comment ID', () => {
                return request.del(`/api/comments/newcomment`)
               .expect(400)
                .then(res => {
                   expect(res.body.message).to.equal('Invalid comment ID');
                });
            });
        });
    });
    describe('/users', () => {
        describe('/:username', () => {
            it('GET returns 200 and a certain user', () => {
                return request.get(`/api/users/${userDocs[0].username}`)
                .expect(200)
                .then(res => {
                    expect(res.body.user.name).to.equal('jonny');
                });
            });
            it('GET returns 400 and error message for invalid username', () => {
                return request.get(`/api/users/mark`)
                .expect(400)
                .then(res => {
                    expect(res.body.message).to.equal('Invalid username');
                });
            });
        });
    });
});