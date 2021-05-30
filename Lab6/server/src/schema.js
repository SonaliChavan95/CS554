const { gql } = require('apollo-server');
const typeDefs = gql`
  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
    numBinned: Int!
  }

  type Query {
    unsplashImages(pageNum: Int): [ImagePost!]
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
  }

  type Mutation {
    uploadImage(url: String!, description: String, posterName: String, numBinned: Int): ImagePost!
    updateImage(id: ID!, url: String, posterName: String, description: String, userPosted: Boolean, binned: Boolean): ImagePost
    deleteImage(id: ID!): ImagePost
  }
`;

module.exports = typeDefs;