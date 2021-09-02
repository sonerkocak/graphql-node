const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const randomWords = require('random-words');

const schema = buildSchema(`
  type Query {
    saySomething: String,
    sayThings(count: Int!): [String],
  }
`);

const root = {
    saySomething: () => randomWords(),
    sayThings: ({count}) => randomWords(count),
};

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');

/*
{
  saySomething,
  sayThings(count: 3)
}

query test($count: Int!)
{
  saySomething,
  sayThings(count: $count)
}

{
  "count": 3
}
 */