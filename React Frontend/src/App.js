import React, {Suspense} from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import { AuthContext } from "./shared/context/auth-context";
import {useAuth} from './shared/hooks/auth-hook';

import Logout from "./users/components/Logout";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';


const Users = React.lazy(()=>{return import("./users/pages/Users")});
const NewPlace = React.lazy(()=>{return import("./places/pages/NewPlace")});
const UserPlaces = React.lazy(()=>{return import("./places/pages/UserPlaces")});
const UpdatePlace = React.lazy(()=>{return import("./places/pages/UpdatePlace")});
const Auth = React.lazy(()=>{return import("./users/pages/Auth")});

const App = () => {

  const {login, logout, isLoggedIn, token, userId} = useAuth();
  
  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/places/new">
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/logout" exact>
          <Logout />
        </Route>
        <Redirect to="/"></Redirect>
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Redirect to="/"></Redirect>
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        login: login,
        logout: logout,
        userId: userId,
        token: token,
      }}
    >
      <Router>
        <MainNavigation />
        <main><Suspense fallback={<div className="center"><LoadingSpinner/></div>}>{routes}</Suspense></main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
