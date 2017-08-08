# Small Social Network

This project is intended to test and learn graphql

## Requirements

    $ git clone https://github.com/arkgast/graphql-server-example
    $ cd graphql-server-example
    $ yarn
    $ npm run createdb
    $ npm start

and finally go to [http://localhost:3000/graphql](http://localhost:3000/graphql) and that's it.

## Queries

Get the user with his friends

    query {
      node(id:"users:4") {
        id
        ... on User {
          name
          about
          friends {
            name
            about
          }
        }
      }
    }

Get the user with his posts with some extra metadata

    query {
      node(id:"users:1") {
        ... on User {
          posts(first: 1, after:"1:2016-04-01") {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            edges {
              cursor
              node {
                id
                body
              }
            }
          }
        }
      }
    }

Get posts of friends, with authorization just friends can view posts of a user

    {
      node(id:"users:2") {
        ... on User {
          posts {
            edges {
              node {
                id
                ... on Post {
                  body
                }
              }
            }
          }
        }
      }
    }

## Mutation

Insert a post

    mutation {
      createPost(body:"New post!", level:PUBLIC) {
        id
        body
        created_at
      }
    }

Levels are:
  * PUBLIC
  * ACQUAINTANCE
  * FRIEND
  * TOP
