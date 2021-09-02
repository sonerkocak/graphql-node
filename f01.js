const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const randomWords = require('random-words');

const schema = buildSchema(`
  type Query {
    saySomething: String
  }
`);

const root = {
    saySomething: () => randomWords(),
};

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');