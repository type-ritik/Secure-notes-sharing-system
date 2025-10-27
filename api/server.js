// Express Server - Entry point for HTTPS
const express = require("express");

// Access .env
require("dotenv").config();

// Cross-site
const cors = require("cors");

// path
const path = require("path");

// Morgan : Simplifies the process of logging HTTP/HTTPS requests
const logger = require("morgan");

// Helmet : Helps in securing HTTP/HTTPS headers
const helmet = require("helmet");

// Apollo Server express to work '/graphql'
const { ApolloServer } = require("@apollo/server");

// Body parser
const bodyParser = require("body-parser");

// Apollo integration for express middleware
const { expressMiddleware } = require("@as-integrations/express5");

// Query and Mutation and Subscription schema - TypeDefs
const { typeDefs } = require("./schema");

// For logic behind Query and Mutation
const { resolvers } = require("./resolvers");

// Context for Apollo Server
// const { getContext } = require("./context");

// graphql-tools : creates a pure GraphQLSchema object. Independent - works with any GraphQL server
const { makeExecutableSchema } = require("@graphql-tools/schema");

const {
  ApolloServerPluginUsageReporting,
} = require("@apollo/server/plugin/usageReporting");
const { parseAuthHeader } = require("./middleware/auth");

// Start HTTPS and Apollo Server
async function startServer() {
  const app = express();

  // Basic security middlewares
  app.use(helmet());
  app.use(logger("combined"));

  // CORS: configure origins in prod
  app.use(
    cors({
      // origin: "https://studio.apollographql.com",
      credentials: true,
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // body parsing required by expressMiddleware
  app.use(bodyParser.json());

  // parse auth header early so context can read it
  app.use(parseAuthHeader);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Apollo Server setup
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginUsageReporting({ fieldLevelInstrumentation: 0.5 }),
    ],
    apollo: {
      key: process.env.APOLLO_KEY,
      graphRef: process.env.APOLLO_GRAPH_REF,
    },
    cache: "bounded",
  });

  app.get("/", (req, res) => {
    res.send("Hello HTTPS world!");
  });

  await server.start();

  // Mount GraphQL endpoint with expressMiddleware
  app.use("/graphql", expressMiddleware(server));

  return app;
}

module.exports = { startServer };
