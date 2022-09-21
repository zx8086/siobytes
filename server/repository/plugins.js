
const { ApolloServerPluginSchemaReporting, ApolloServerPluginLandingPageProductionDefault, ApolloServerPluginInlineTrace, ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginUsageReporting } = require('apollo-server-core')

const logTriggers = {
    // Fires whenever a GraphQL request is received from a client.
    async requestDidStart(requestContext) {
      console.log('Request started! Query:\n' +
        requestContext.request.query)
  
      return {
        // Fires whenever Apollo Server will parse a GraphQL
        // request to create its associated document AST.
        async parsingDidStart(requestContext) {
          console.log('Parsing started!')
        },
  
        // Fires whenever Apollo Server will validate a
        // request's document AST against your GraphQL schema.
        async validationDidStart(requestContext) {
          console.log('Validation started!')
        },
      }
    },
  }

if (process.env.NODE_ENV === 'production') {
  plugins = [
    logTriggers,
    ApolloServerPluginSchemaReporting(),
    ApolloServerPluginInlineTrace(),
    ApolloServerPluginLandingPageProductionDefault({ embed: true, graphRef: 'siobytes@current', footer: true }),
    // ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    // ApolloServerPluginUsageReporting(),
    ApolloServerPluginUsageReporting({
      sendHeaders: { all: true },
      generateClientInfo: ({
        request
      }) => {
        // const headers = request.http && request.http.headers
        const headers = request.http.headers
        console.log('headers', headers)
        if(headers) {
          return {
            clientName: headers.get('apollographql-client-name'),
            clientVersion: headers.get('apollographql-client-version'),
          }
        } else {
          return {
            clientName: "Unknown Client",
            clientVersion: "Unversioned",
          }
        }
      },
      sendVariableValues: { all: true },
    })
    // ApolloServerPluginUsageReporting({
    //     generateClientInfo: ({ request }) => {
    //       const { clientName, clientVersion } = userSuppliedLogic(request);
    //       return {
    //         clientName,
    //         clientVersion
    //       };
    //     }
    //   })
  ]
  } else {
  plugins = [
    ApolloServerPluginSchemaReporting(),
    ApolloServerPluginInlineTrace(),
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ApolloServerPluginUsageReporting({
      generateClientInfo: ({ request }) => {
        const { clientName, clientVersion } = userSuppliedLogic(request)
        return {
          clientName,
          clientVersion
        }
      }
    })
  ]
}

module.exports = plugins