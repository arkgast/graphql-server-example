import express from 'express'
import basicAuth from 'basic-auth-connect'
import graphqlHTTP from 'express-graphql'
import {
  GraphQLSchema, GraphQLObjectType, GraphQLString,
  GraphQLNonNull, GraphQLID
} from 'graphql'

import { NodeInterface, UserType, PostType } from './src/types'
import * as loaders from './src/loaders'


const app = express()

app.use(basicAuth((user, pass) => {
  return user === '1' && pass === 'password'
}))

// Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'The root query',
  fields: {
    viewer: {
      type: NodeInterface,
      resolve (source, args, context) {
        return loaders.getNodeById(context)
      }
    },
    node: {
      type: NodeInterface,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve (source, args, context, info) {
        let includeFriends = false

        const selectionFragments = info.operation.selectionSet.selections
        const userSelections = selectionFragments.filter((selection) => {
          return selection.kind === 'InlineFragment' &&
            selection.typeCondition.name.value === 'User'
        })

        userSelections.forEach((selection) => {
          selection.selectionSet.selections.forEach((innerSelection) => {
            if (innerSelection.name.value === 'friends') {
              includeFriends = true
            }
          })
        })

        if (includeFriends) {
          return loaders.getUserNodeWithFriends(args.id)
        } else {
          return loaders.getNodeById(args.id)
        }
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
  types: [UserType, PostType],
  query: RootQuery,
  mutation: RootMutation
})

// app.use('/graphql', graphqlHTTP({ schema: Schema, graphiql: true }))
app.use('/graphql', graphqlHTTP((req) => {
  const context = 'users:' + req.user
  return { schema: Schema, graphiql: true, context: context, pretty: true }
}))

app.listen(3000, () => {
  console.log('Im running!')
})
