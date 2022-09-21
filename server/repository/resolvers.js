
const { cbConnect } = require('./cbConnect')


const books = [
    {
      title: 'The Awakening',
      author: 'Kate Chopin',
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster',
    },
  ]

module.exports = {
    Query: {
        books: () => books,
        programmes: async () => {
 
            // const { cbConnect } = require('./cbConnect')
            var cluster = await cbConnect()
            let query = `
            SELECT Media.*
            FROM HA_MEDIA_PLAYER AS Media
            WHERE (Media.state = $1) AND (Media.friendlyName <> $2) 
            AND (Media.title IS NOT NULL AND Media.title <> "") 
            AND (Media.programmeTimestamp >= $3) --- AND (Media.season IS NOT NULL)
            ORDER BY programmeTimestamp DESC
            LIMIT 20
            `

            const options = { parameters: ["playing","Living Room","2022-09-21"] }
            
            try {
                let result = await cluster.query(query, options)
                console.log("Result:", result)
                return result.rows
            } catch (error) {
                console.error('Query failed: ', error)
            } 
        },
        programmeByKey: async (_, args) => {

            // const { cbConnect } = require('./cbConnect')
            var cluster = await cbConnect()
            const bucketName = 'HA_MEDIA_PLAYER'
    
            const bucket = cluster.bucket(bucketName)
            const collection = bucket.scope('_default').collection('_default')
    
            let key =  args.ID
            console.log("Key:", key)
    
            try {
                const result = await collection.get(key, { timeout: 1000 });
                console.log("Result:", result)
                return result.content
            } 
            catch (error) {
                console.error('Retrieve failed: ', error)
            }             

        },
        techQuotes: async (_, __, { dataSources }) => {
            return dataSources.techQuotesAPI.getTechQuotes()
        },
        techQuoteByKey: async (_, args, { dataSources }) => {
            return dataSources.techQuotesAPI.getTechQuoteByKey(args.ID)
        },
    }
}

// const resolvers = {
//     Mutation: {
//       assignSpaceship: async (_, { spaceshipId, missionId }, { dataSources }) => {
//         const { spaceship, mission } = await dataSources.spaceAPI.assignSpaceshipToMission(spaceshipId, missionId);
//         return {
//           code: 200,
//           success: true,
//           message: `Successfully assigned spaceship ${spaceshipId} to mission ${missionId}`,
//           spaceship: spaceship,
//           mission: mission
//         }
//       }
//     }
//   }

