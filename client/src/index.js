import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import './index.css';
import App from './App';
import UserContext from './UserContext'
import registerServiceWorker from './registerServiceWorker';

/**
 * Lets pretend that we already had the user logged in, and we store the
 * user object here.
 */
const users = [
  {
    id: '0123-0123',
    username: 'clarencenpy',
    token: 'secret-token-a',
  },
  {
    id: '1111-1111',
    username: 'evans',
    token: 'secret-token-b',
  },
];
const loggedInUser = users[0]
localStorage.setItem('token', loggedInUser.token)

// Use apollo-boost to initialize with useful defaults
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql/',
  request: async (operation) => {
    const token = localStorage.getItem('token')
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  },
});

const ApolloApp = () => (
  <ApolloProvider client={client}>
    <UserContext.Provider value={loggedInUser}>
      <App />
    </UserContext.Provider>
  </ApolloProvider>
);

ReactDOM.render(<ApolloApp />, document.getElementById('root'));
registerServiceWorker();
