import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { gql } from 'apollo-boost';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import red from '@material-ui/core/colors/red';
import Chip from '@material-ui/core/Chip';
import UserContext from '../UserContext';
import { pathOr } from 'ramda';

const styles = () => ({
  card: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

const ATTEND_EVENT = gql`
  mutation attendEvent($eventId: String!) {
    attendEvent(eventId: $eventId) {
      event {
        id
        attendees {
          username
        }
      }
      errors {
        message
      }
    }
  }
`;

class EventCard extends React.Component {
  /**
   * Playing around with updating the cache directly, without making use of
   * HOC or render props.
   */
  handleAttendEvent(client, eventId) {
    client
      .mutate({
        mutation: ATTEND_EVENT,
        errorPolicy: 'all',
        variables: {
          eventId,
        },
      })
      .then(mutationState => {
        // Use ramda to avoid checking for null in deeply nested objects
        const errors = pathOr(
          [],
          ['data', 'attendEvent', 'errors'],
          mutationState
        );
        if (errors.length > 0) {
          errors.forEach(err => alert(err.message));
        }
      });
    /**
     * Useful trick: Make use of the fact that apollo-client performs cache
     * update automatically, when the result that was returned by the
     * mutation has all the necessary fields to update the normalized cache
     * item, which is the event object in this case.
     */
  }

  render() {
    const { event, classes } = this.props;
    return (
      <ApolloConsumer>
        {client => (
          <UserContext.Consumer>
            {loggedInUser => {
              const alreadyAttending = !!event.attendees.find(
                user => user.username === loggedInUser.username
              );

              return (
                <div>
                  <Card className={classes.card}>
                    <CardHeader
                      avatar={
                        <Avatar className={classes.avatar}>
                          {event.createdBy.username.toUpperCase()[0]}
                        </Avatar>
                      }
                      title={event.name}
                      subheader={event.date}
                    />
                    <CardMedia
                      className={classes.media}
                      image={event.photoUrl}
                    />
                    <CardActions className={classes.actions}>
                      {alreadyAttending ? (
                        <Button size="small" variant="outlined" disabled>
                          Attending
                        </Button>
                      ) : (
                        <Button
                          onClick={this.handleAttendEvent.bind(
                            null,
                            client,
                            event.id
                          )}
                          size="small"
                          variant="outlined"
                          color="primary"
                        >
                          Attend
                        </Button>
                      )}
                      <Chip
                        label={`${event.capacity -
                          event.attendees.length} places left`}
                      />
                    </CardActions>
                  </Card>
                </div>
              );
            }}
          </UserContext.Consumer>
        )}
      </ApolloConsumer>
    );
  }
}

export default withStyles(styles)(EventCard);
