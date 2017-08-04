import express from 'express'
import graphqlHTTP from 'express-graphql'
import {
  GraphQLSchema, GraphQLObjectType, GraphQLString,
  GraphQLNonNull, GraphQLID
} from 'graphql'


const app = express()

// Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'The root query',
  fields: {
    node: {
      type: GraphQLString,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve (source, args) {
        return inMemoryStore[args.id]
      }
    }
  }
})

// Mutation
let inMemoryStore = {}
const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  description: 'The root mutation',
  fields: {
    setNode: {
      type: GraphQLString,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        },
        value: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve (source, args) {
        inMemoryStore[args.id] = args.value
        return inMemoryStore[args.id]
      }
    }
  }
})

const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
})

app.use('/graphql', graphqlHTTP({ schema: Schema, graphiql: true }))

app.listen(3000, () => {
  console.log('Im running!')
})
