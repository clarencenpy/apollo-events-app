import { GraphQLDate, GraphQLTime } from 'graphql-iso-date';
import Event from './models/Event';
import User from './models/User';
import { ForbiddenError } from 'apollo-server'
import validator from 'validator';

export const resolvers = {
  Date: GraphQLDate,
  Time: GraphQLTime,

  /**
   * Model Resolvers:
   * This is where we would define how to resolve nested/relational fields
   */
  User: {
    events(root) {
      return Event.getAllByUserId(root.id);
    },
  },

  Event: {
    createdBy(root) {
      return User.getById(root.createdBy);
    },
    attendees(root) {
      return root.attendees.map(userId => User.getById(userId));
    },
  },

  /**
   * Root query type
   */
  Query: {
    events() {
      return Event.getAll();
    },
    event(id) {
      return Event.getById(id);
    },
    users() {
      return User.getAll();
    },
  },

  /**
   * Root mutation type
   */
  Mutation: {
    addEvent(root, { event }, { user }) {

      // permissions check
      if (!user) {
        throw new ForbiddenError('Must be logged in to create event');
      }

      // custom validation for user input fields
      const validationErrors = [];
      if (
        !validator.isLength(event.name, {
          max: 20,
        })
      ) {
        validationErrors.push({
          field: 'name',
          message: 'Event name cannot be longer than 20 characters',
        });
      }
      if (event.capacity <= 0) {
        validationErrors.push({
          field: 'capacity',
          message: 'Event capacity cannot be <= 0',
        });
      }
      if (event.date.getTime() < new Date().getTime()) {
        validationErrors.push({
          field: 'date',
          message: 'Event date must take place in the future',
        });
      }
      if (!validator.isURL(event.photoUrl)) {
        validationErrors.push({
          field: 'photoUrl',
          message: 'URL is not valid',
        });
      }

      if (validationErrors.length > 0) {
        return {
          validationErrors
        };
      }

      return { event: Event.add(event, user.id) };
    },

    attendEvent(root, { eventId }, { user }) {
      if (!user) {
        throw ForbiddenError('Must be logged in to attend event');
      }

      // Validate your app specific business logic
      const event = Event.getById(eventId);

      if (user.id === event.createdBy) {
        return {
          errors: [{ message: 'Cannot attend event that you created' }],
        };
      }
      if (event.capacity === event.attendees.length) {
        return {
          errors: [{ message: 'Event is at maximum capacity' }],
        };
      }
      const attendee = event.attendees.find(userId => userId === user.id);
      if (attendee) {
        return {
          errors: [{ message: 'Already attending this event' }],
        };
      }

      return { event: Event.addAttendee(eventId, user.id) };
    },
  },
};
