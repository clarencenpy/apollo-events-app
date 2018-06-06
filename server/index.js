import { ApolloServer } from 'apollo-server';
import { typeDefs } from './src/schema';
import { resolvers } from './src/resolvers';
import User from './src/models/User';

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // sleep here to simulate some network latency
    return sleep(500).then(() => {
      const token = req.headers.authorization || '';
      const user = User.authenticateWithToken(token);
      return { user };
    });
  },
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
