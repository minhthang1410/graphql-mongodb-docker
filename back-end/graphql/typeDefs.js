const { gql } = require('apollo-server-express');

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }
  type UserLogin {
    token: String!
    username: String!
    avatar: String!
    bio: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type UserProfile {
    username: String!
    avatar: String!
    bio: String!
    email: String!
  }
  type Query {
    hello: String!
    getProfile: UserProfile!
    getPosts: [Post]
    getPost(postId: ID!): Post
  }
  input UpdateProfileInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
    bio: String!
    avatar: String!
  }
  type Mutation {
    register(registerInput: RegisterInput): String!
    login(username: String!, password: String!): UserLogin!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
  type Subscription {
    newPost: Post!
  }
`;