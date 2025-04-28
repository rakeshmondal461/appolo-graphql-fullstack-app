const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");

const PORT = process.env.PORT || 4008;

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs: `
      type Todo {
        id: ID!
        title: String!
        completed: Boolean
      }

      type Query {
        getTodos: [Todo]
      }
    `,
    resolvers: {
      Query: {
        getTodos: () => [
          { id: "1", title: "First Todo", completed: false },
        ]
      }
    }
  });

  await server.start();

  app.use(cors());
  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => ({}) // 👈 REQUIRED even if empty
    })
  );

  app.listen(PORT, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
  );
}

startServer();
