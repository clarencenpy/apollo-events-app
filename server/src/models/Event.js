import uuid from 'uuid/v4';

const events = [
  {
    id: 'event-1111-1111',
    name: 'Carnaval 2018',
    date: '2018-06-12',
    capacity: 10,
    photoUrl:
      'http://cdn.funcheap.com/wp-content/uploads/2016/04/50c980e2892eb60e6b86feb49cb98eda5b892d7f1-563x375.jpg',
    attendees: [],
    createdBy: '0123-0123',
  },
  {
    id: 'event-2222-2222',
    name: 'Food Festival',
    date: '2018-06-27',
    capacity: 5,
    photoUrl:
      'http://www.vietnamtourism.com/imguploads/news/2017/T12/Foodfest.jpg',
    attendees: [],
    createdBy: '1111-1111',
  },
];

const Event = {
  getAll() {
    return events;
  },
  getById(id) {
    return events.find(event => event.id === id);
  },
  getAllByUserId(userId) {
    return events.filter(event => event.createdBy === userId);
  },
  add(event, userId) {
    const newEvent = {
      id: uuid(),
      createdBy: userId,
      attendees: [],
      ...event,
    };
    events.push(newEvent);
    return newEvent;
  },

  addAttendee(eventId, userId) {
    // Add to attendee list
    const event = Event.getById(eventId);
    event.attendees.push(userId);
    return event;
  },
};

export default Event;
