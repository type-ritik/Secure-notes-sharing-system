const { gql } = require("graphql-tag");

const typeDefs = gql`
  scalar DateTime

  type Query {
    hello: String!
    me: User
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload!
  }

  type User {
    id: ID!
    username: String!
    name: String
    createdAt: DateTime!
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;

module.exports = { typeDefs };
