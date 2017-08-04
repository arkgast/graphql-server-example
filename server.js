import express from 'express'
import graphqlHTTP from 'express-graphql'
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'


const app = express()

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'The root query',
  fields: {
    viewer: {
      type: GraphQLString,
      resolve () {
        return 'viewer!'
      }
    }
  }
})

const Schema = new GraphQLSchema({
  query: RootQuery
})

app.use('/graphql', graphqlHTTP({ schema: Schema, graphiql: true }))

app.listen(3000, () => {
  console.log('Im running!')
})
