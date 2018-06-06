import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import EventCard from './EventCard';
import { Link } from 'react-router-dom';

export const GET_EVENTS = gql`
  query getEvents {
    events {
      id
      name
      photoUrl
      capacity
      date
      createdBy {
        username
      }
      attendees {
        username
      }
    }
  }
`;

const AddEventButton = () => (
  <Grid container justify="center">
    <Grid item xs={4}>
      <Button
        fullWidth
        component={Link}
        to="addEvent"
        variant="raised"
        size="large"
        color="primary"
      >
        Create Event
      </Button>
    </Grid>
  </Grid>
);

const EventList = () => (
  <Query query={GET_EVENTS}>
    {({ loading, error, data }) => {
      if (loading) return <LinearProgress/>
      if (error) return <p>{error.message}</p>;
      return (
        <div>
          <AddEventButton />
          <br/>
          <Grid className="eventList" container spacing={16} justify="flex-start">
            {data.events.map(event => (
              <Grid item xs={8} sm={6} md={4} key={event.id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        </div>
      );
    }}
  </Query>
);

export default EventList;
