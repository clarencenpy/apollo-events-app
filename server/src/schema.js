import { gql } from 'apollo-server';

const typeDefs = gql`
  scalar Date

  scalar Time

  type User {
    id: ID!
    username: String!
    events: [Event]
  }

  type Event {
    id: ID!
    name: String!
    date: Date!
    capacity: Int!
    photoUrl: String!
    attendees: [User]!
    createdBy: User
  }

  type Query {
    events: [Event]!
    event(id: String!): Event
    users: [User]!
    user(id: String!): User
  }

  # Define input and return types for mutations
  input EventInput {
    name: String!
    date: Date!
    capacity: Int!
    photoUrl: String!
  }

  type FieldValidationError {
    field: String!
    message: String!
  }
  
  type Error {
    message: String!
  }

  type AddEventResult {
    event: Event
    validationErrors: [FieldValidationError!]
  }

  type AttendEventResult {
    event: Event
    errors: [Error!]
  }

  type Mutation {
    addEvent(event: EventInput!): AddEventResult
    attendEvent(eventId: String): AttendEventResult
  }
`;

export { typeDefs };
