/* eslint no-console: 0 */
import express from "express";
import GraphQLHTTP from "express-graphql";
import schema from "./graphqlSchema";

const app = express();
const PORT = 9090;

app.use("/graphql", GraphQLHTTP({
  schema,
  graphiql: true,
  pretty: true
}));

app.listen(PORT, () => {
 console.log('Node/Express server for GraphQL. listening on port', PORT);
});
