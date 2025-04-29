const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const axios = require("axios");

const PORT = process.env.PORT || 4008;

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs: `
      type User {
        id:ID!
        username:String!
        name:String!
        email:String!
        phone:String!
        website:String!
      }

      type Todo {
        userId:ID!
        id: ID!
        title: String!
        completed: Boolean
      }

      type Query {
        getTodos: [Todo]
        getAllUsers:[User]
        getUser(id:ID!):User
      }
    `,
    resolvers: {
      Query: {
        getTodos: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
        getAllUsers: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
        getUser: async (parent, { id }) =>
          (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`))
            .data,
      },
    },
  });

  await server.start();

  app.use(cors());
  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => ({}), // 👈 REQUIRED even if empty
    })
  );

  app.listen(PORT, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
  );
}

startServer();
