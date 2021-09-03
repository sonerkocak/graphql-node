const { readFileSync } = require('fs')
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {buildSchema} = require("graphql");

let id = 0;
const POSTS = [];

const schema = buildSchema(readFileSync('./f02.graphql').toString('utf-8'));

const root = {
    posts: () => POSTS,
    addPost: ({ input: { text, tags } }) => {
        POSTS.push({id: `${++id}`, text, tags, comments: []});
        console.log('POSTS', POSTS);
        return 'OK';
    },
    addComment: ({ id, input: { text } }) => {
        const post = POSTS.find( val => val.id === id);
        post.comments.push({id: `${++id}`, text});
        console.log('POSTS', POSTS);
        return 'OK';
    },
};

function loggingMiddleware (req, res, next) {
    console.log('ip:', req.ip);
    next();
}

const app = express();
app.use(loggingMiddleware);
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');

/*
mutation postEkle {
  addPost(input: {text: "Post 01", tags: ["a", "b"]})
  addComment(id: 1, input: {text: "Comment 01"})
}

query sorgula {
  posts {
    id, text, tags, comments {id, text}
  }
}

{
  req1: posts {
    ...postFields
  }
  req2: posts {
    ...postFields
  }
}

fragment postFields on Post {
  text
  comments {
    text
  }
}
 */