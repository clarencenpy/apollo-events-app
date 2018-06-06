import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import AddEventForm from './components/AddEventForm';
import EventList from './components/EventList';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <Link to="/">
              <h1 className="App-title">Events @San Francisco</h1>
            </Link>
          </header>
          <div className="App-body">
            <Switch>
              <Route exact path="/" component={EventList} />
              <Route exact path="/addEvent" component={AddEventForm} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
