const express = require('express');
// const ExpressGraphQL = require("express-graphql");
const {graphqlHTTP} = require('express-graphql');

const PORT = 9000;
const schema = require("./graphql/post/post.js");
const app = express();

app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema.schema,
        graphiql: true
    })
);

app.listen(PORT, () => {
    console.log("GraphQL server running at http://localhost:" + PORT);
});
