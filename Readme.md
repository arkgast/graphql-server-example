# Small Facebook Clone

This project is intended to test and learn graphql

## Steps to test it

    $ git clone https://github.com/arkgast/graphql-server-example
    $ cd graphql-server-example
    $ yarn
    $ node index.js

and finally go to [http://localhost:3000/graphql](http://localhost:3000/graphql)

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
          posts(first: 1) {
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
