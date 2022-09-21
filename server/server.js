require('dotenv').config()

const { ApolloServer } = require('apollo-server')

const typeDefs = require('./repository/schema')
const resolvers = require('./repository/resolvers')
const plugins = require('./repository/plugins')

const mocks = require('./datasources/mocks')
const techQuotesAPI = require('./datasources/techQuote')

const dataSources = () => ({
  techQuotesAPI: new techQuotesAPI
})

// const { bootstrap: bootstrapGlobalAgent } = require('global-agent')
// Setup global support for environment variable based proxy configuration.
// bootstrapGlobalAgent()

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  debug: true,
  // mocks,
  async onHealthCheck() {
    if (everythingLooksHealthy()) {
      return
    } else {
      throw new Error('...')
    }
  },
  dataSources,
  // context,
  introspection: true,
  // cors: {
  //   origin: ["https://apollo-graphql.siobytes.com", "https://studio.apollographql.com"]
  // },
  apollo: {
    key: process.env.APOLLO_KEY,
  },
  plugins
})

// Start our server if we're not in a test env.
// if we're in a test env, we'll manually start it in a test
if (process.env.NODE_ENV !== 'test') {
  server.listen().then(({ url }) => {
    console.log(`
    🚀  Server is ready...
    🔉  Listening on port 4000
    📭  Query at ${url}
    `)
    console.log(`Try your health check at: ${url}.well-known/apollo/server-health`)
  })
}

// export all the important pieces for integration/e2e tests to use
module.exports = {
  dataSources,
  // context,
  typeDefs,
  resolvers,
  // mocks,
  ApolloServer,
  // store,
  server,
}

// import { ApolloServer } from 'apollo-server-express';
// import {
//   ApolloServerPluginDrainHttpServer,
//   ApolloServerPluginLandingPageLocalDefault,
// } from 'apollo-server-core';
// import express from 'express';
// import http from 'http';

// async function startApolloServer(typeDefs, resolvers) {
//   const app = express();
//   const httpServer = http.createServer(app);
//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     csrfPrevention: true,
//     cache: 'bounded',
//     plugins: [
//       ApolloServerPluginDrainHttpServer({ httpServer }),
//       ApolloServerPluginLandingPageLocalDefault({ embed: true }),
//     ],
//   });

//   await server.start();
//   server.applyMiddleware({ app });
//   await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
//   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
// 

// import responseCachePlugin from 'apollo-server-plugin-response-cache';
// const server = new ApolloServer({
//   // ...other settings...
//   plugins: [responseCachePlugin({
//     sessionId: (requestContext) => (requestContext.request.http.headers.get('session-id') || null),
//   })],
// });

// --- apollo-server-express
// const express = require('express');
// const { ApolloServer } = require('apollo-server-express');
// const {
//   ApolloServerPluginDrainHttpServer,
//   ApolloServerPluginLandingPageLocalDefault,
// } = require('apollo-server-core');
// const { typeDefs, resolvers } = require('./schema');
// const http = require('http');

// async function startApolloServer() {
//   const app = express();
//   // Our httpServer handles incoming requests to our Express app.
//   // Below, we tell Apollo Server to "drain" this httpServer,
//   // enabling our servers to shut down gracefully.
//   const httpServer = http.createServer(app);
//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     csrfPrevention: true,
//     cache: 'bounded',
//     plugins: [
//       ApolloServerPluginDrainHttpServer({ httpServer }),
//       ApolloServerPluginLandingPageLocalDefault({ embed: true }),
//     ],
//   });

//   await server.start();

//   // Mount Apollo middleware here.
//   server.applyMiddleware({ app });
//   await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
//   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
//   return { server, app };
// }
// ---

// const resolvers = {
//   Query: {
//     spaceCats: (_, __, {dataSources}) => {
//       return dataSources.spaceCatsAPI.getSpaceCats();
//     }
//   },
//   // write the SpaceCat.missions resolver below
//   SpaceCat: {
//     missions: ({catId}, _, {dataSources}) => {
//       return dataSources.spaceCatsAPI.getMissions(catId);
//     }
//   }
// };

// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema: schema,
//     rootValue: root,
//     graphiql: true,
//   }),
// );
 
// // app.listen(4000);

// const serverPort = 4000
// const serverUrl = '/graphql'
// // app.use(serverUrl, graphqlHTTP({
// //   schema: schema,
// //   rootValue: root,
// //   graphiql: true
// // }))