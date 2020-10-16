import React from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

import Users from './users/pages/Users';
import Auth from './users/pages/Auth';
import NewPlace from './places/pages/NewPlace';
import UpdatePlace from './places/pages/UpdatePlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';


const App = ()=>{
  return (
    <Router>
      <MainNavigation/>
      <main>
      <Switch>
        <Route path="/" exact>
            <Users/>
        </Route>
        <Route path="/auth" exact>
            <Auth/>
        </Route>
        <Route path="/places/new">
            <NewPlace/>
        </Route>
        <Route path="/places/:placeId">
            <UpdatePlace/>
        </Route>
        <Route path="/:userId/places" exact>
            <UserPlaces></UserPlaces>
        </Route>
        <Redirect to="/"></Redirect>
      </Switch>
      </main>
    </Router>
  )
};

export default App;
