const { gql } = require('apollo-server')

const typeDefs = gql`

    type Query {
        books: [Book]
        programmes: [Programme]
        programmeByKey(ID: String!): Programme
        techQuotes: TechQuote
        techQuoteByKey(ID: String!): TechQuote
    }

    type Book @cacheControl(maxAge: 240) {
        title: String @cacheControl(inheritMaxAge: true),
        author: String
    }

    type ProgrammeConn { 
        cursor: String!
        hasMore: Boolean!
        programmes: [Programme]!
      }

    type Programme {
        id: String,
        programmeTimestamp: String,
        programmeId: String,
        friendlyName: String,
        appName: String,
        appId: String,
        libraryTitle: String,
        seriesTitle: String,
        title: String,
        summary: String,
        season: String,
        duration: Int,
        position: Int,
        state: String
    }

    "Programming Quotes from Heroku."
    type TechQuote {
        "UUID for quote from Heroku Programming Quotes."
        id: String
        "Author of quote."
        author: String
        "Quote in english."
        en: String
        "HTTP URL for quote with UUID."
        url: String @cacheControl(maxAge: 10, scope: PRIVATE)
        "Context for quote, used for source as well."
        description: String 
        "Source where quote was produced."
        source: String @deprecated(reason: "Use description instead.")
    }

    enum CacheControlScope {
        PUBLIC
        PRIVATE
    }

    directive @cacheControl(
        maxAge: Int
        scope: CacheControlScope
        inheritMaxAge: Boolean
    ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION
`
module.exports = typeDefs
