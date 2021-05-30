import React from 'react';
import { render } from 'react-dom';
import './css/index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
// import { ApolloProvider } from '@apollo/client/react';
// import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql"
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  // uri: 'http://localhost:4000',
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache()
});

// {
//   typePolicies: {
//     Query: {
//       fields: {
//         feed: {
//           // Don't cache separate results based on
//           // any of this field's arguments.
//           keyArgs: false,
//           // Concatenate the incoming list items with
//           // the existing list items.
//           merge(existing = [], incoming) {
//             return [...existing, ...incoming];
//           },
//         }
//       }
//     }
//   }
// }

// render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
