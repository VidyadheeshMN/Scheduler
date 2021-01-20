import React from 'react';
import './App.css';
import Calendar from './Components/Calendar';
import Dropdown from './Components/dropdown';
import LoginPage from './Components/LoginPage';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom'
import ShowEvents from './Components/ShowEvents';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path='/' component={() => <LoginPage/>}/>
        <Route path='/calendar' component={() => <Calendar/>}/>
        <Route path='/events' component={() => <ShowEvents/>}/>
      </Switch>
    </div>
  );
}

export default App;