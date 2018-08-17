# Nortcoders News API

## Introduction

Welcome to Northcoders News API! This respository contains database which consists of files with various articles, users, topics and comments. The API allows for comments to be added to articles and articles to be added to topics. It also allows user to vote up or down for both articles and comments. For more information about available endpoints please check Routes section. The app has been deployed to Heroku and you can check it out here https://d-northcoders-news-api.herokuapp.com/api

## Getting Started

Clone this repository using command below:

`$ git clone https://github.com/dotty11/BE2-northcoders-news`

## Installation

Navigate to cloned repository and install all dependencies and dev dependencies on your computer:

`$ npm install`

This will install the following packages:


Dependencies:
* body-parser: ^1.18.3
* express: ^4.16.3
* mongoose: ^5.2.8
* ejs: ^2.6.1

Dev dependencies:
* chai: ^4.1.2
* mocha: ^5.2.0
* nodemon: ^1.18.3
* supertest: ^3.1.0

Make sure that you have MongoDB installed:

`$ mongo --version`

Start MongoDB in separate terminal:

`$ mongod`

Then seed the database in your integrated terminal:

`$ npm run seed:dev`

And start your local server:

`$ npm run dev`

You should see this in your terminal: 

```
listening on 9090...
connected to mongodb://localhost:27017/northcoders_news...
```

Now you are ready to open the app in your browser or Postman with this URL:

`localhost:9090/api`

## Tests

If you would like to run tests you need to stop server from listening using Ctrl+C command.
Now run this command in your integrated terminal:

`$ npm t`

## Routes

The following endpoints are available:

```http
GET /api
```
Homepage


```http
GET /api/topics
```

Gets all the topics

```http
GET /api/topics/:topic_slug/articles
```

Returns all the articles for a certain topic, e.g: `/api/topics/football/articles`

```http
POST /api/topics/:topic_slug/articles
```

Adds a new article to a topic. This route requires a JSON body with title and body key value pairs
e.g: `{ "title": "new article", "body": "This is my new article content"}`

```http
GET /api/articles
```

Returns all the articles

```http
GET /api/articles/:article_id
```

Gets an individual article

```http
GET /api/articles/:article_id/comments
```

Gets all the comments for a individual article

```http
POST /api/articles/:article_id/comments
```

Adds a new comment to an article. This route requires a JSON body with body and created_by key value pairs
e.g: `{"body": "This is my new comment", "created_by": <mongo id for a user>}`

```http
PUT /api/articles/:article_id
```

Increments or decrements the votes of an article by one. This route requires a vote query of 'up' or 'down'
e.g: `/api/articles/:article_id?vote=up`

```http
PUT /api/comments/:comment_id
```

Increments or decrements the votes of a comment by one. This route requires a vote query of 'up' or 'down'
e.g: `/api/comments/:comment_id?vote=down`

```http
DELETE /api/comments/:comment_id
```

Deletes a comment

```http
GET /api/users/:username
```

e.g: `/api/users/mitch123`

Returns a JSON object with the profile data for the specified user.


