import React from 'react';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';
import { path, pathOr } from 'ramda';
import { GET_EVENTS } from './EventList';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import red from '@material-ui/core/colors/red';

const styles = () => ({
  container: {
    padding: 20,
  },
  textField: {
    marginTop: 10,
    marginBottom: 10,
  },
  errorHeader: {
    color: red[500],
  },
  errorItem: {
    color: red[500],
  },
});

const ADD_EVENT = gql`
  mutation addEvent($event: EventInput!) {
    addEvent(event: $event) {
      event {
        id
        name
        date
        capacity
        photoUrl
        createdBy {
          username
        }
        attendees {
          username
        }
      }
      validationErrors {
        field
        message
      }
    }
  }
`;

const FormErrors = ({ error, classes }) => {
  if (error) {
    const graphQLErrors = error.graphQLErrors || [];
    return (
      <div>
        <h4 className={classes.errorHeader}>
          Error occured when creating event
        </h4>
        <ul>
          {graphQLErrors.map(err => (
            <li className={classes.errorItem}>{err.message}</li>
          ))}
          {error.networkError && <li>{error.networkError.message}</li>}
        </ul>
      </div>
    );
  } else {
    return null;
  }
};

/**
 * Wrapper class around TextField to keep us DRY when trying to display
 * validation errors that are returned as part of the graphql schema
 */
class ValidationTextField extends React.Component {
  getErrorMessageForField(fieldName, validationErrors) {
    if (validationErrors.length === 0) return;
    const err = validationErrors.find(err => err.field === fieldName);
    if (err) {
      return err.message;
    }
  }

  render() {
    const {
      name,
      label,
      helperText,
      classes,
      validationErrors,
      parent,
    } = this.props;

    const errorMessage = this.getErrorMessageForField(name, validationErrors);

    return (
      <TextField
        className={classes.textField}
        fullWidth
        error={!!errorMessage}
        helperText={errorMessage || helperText}
        id={name}
        label={label}
        value={parent.state[name]}
        onChange={parent.handleChange(name)}
      />
    );
  }
}

class AddEventForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      date: '',
      capacity: '',
      photoUrl: '',
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Mutation
        mutation={ADD_EVENT}
        update={(cache, mutationState) => {
          let newEvent = path(['data', 'addEvent', 'event'], mutationState);
          const { events } = cache.readQuery({ query: GET_EVENTS });
          cache.writeQuery({
            query: GET_EVENTS,
            data: { events: events.concat([newEvent]) },
          });
        }}
      >
        {(addEvent, { data, loading, error }) => {
          const newEvent = path(['addEvent', 'event'], data);
          const validationErrors = pathOr([], ['addEvent', 'validationErrors'], data);

          // mutation succeeded
          if (newEvent) return <Redirect to="/"/>

          return (
            <Grid container justify="center">
              <Grid item xs={10} md={8}>
                <Paper className={classes.container}>
                  <h2>Create New Event</h2>

                  {loading && <LinearProgress />}
                  {error && <FormErrors error={error} classes={classes} />}

                  <form noValidate autoComplete="off">
                    <ValidationTextField
                      name="name"
                      label="Event Name"
                      helperText=""
                      validationErrors={validationErrors}
                      classes={classes}
                      parent={this}
                    />
                    <ValidationTextField
                      name="date"
                      label="Event Date"
                      helperText="yyyy-mm-dd"
                      validationErrors={validationErrors}
                      classes={classes}
                      parent={this}
                    />
                    <ValidationTextField
                      name="capacity"
                      label="Capacity"
                      helperText="Maximum number of people that can attend"
                      validationErrors={validationErrors}
                      classes={classes}
                      parent={this}
                    />
                    <ValidationTextField
                      name="photoUrl"
                      label="Photo URL"
                      helperText="Provide a nice photo for your event"
                      validationErrors={validationErrors}
                      classes={classes}
                      parent={this}
                    />
                  </form>
                  <br />
                  <Button
                    onClick={addEvent.bind(null, {
                      variables: {
                        event: {
                          ...this.state,
                        },
                      },
                    })}
                    variant="raised"
                    color="primary"
                  >
                    Create
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          );
        }}
      </Mutation>
    );
  }
}

export default withStyles(styles)(AddEventForm);
