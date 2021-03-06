import React, {useState} from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import './App.css';
import SignupPage from '../SignupPage/SignupPage';
import LoginPage from '../LoginPage/LoginPage';
import userService from '../../utils/userService'
import HomePage from '../HomePage/HomePage';
import OnBoardingPage from '../OnBoardingPage/OnBoardingPage';
import MessagePage from '../MessagePage/MessagePage';
import ViewMessagesPage from '../ViewMessagesPage/ViewMessagesPage';
import DashboardPage from '../DashboardPage/DashboardPage';
import MatchingPage from '../MatchingPage/MatchingPage';
import RequestsPage from '../RequestsPage/RequestsPage';

function App() {

  const [user, setUser] = useState(userService.getUser()) // getUser decodes our JWT token, into a javascript object
  // this object corresponds to the jwt payload which is defined in the server signup or login function that looks like
  // this  const token = createJWT(user); // where user was the document we created from mongo

  function handleSignUpOrLogin(){
    setUser(userService.getUser ()) // getting the user from localstorage decoding the jwt
  }

  // Alias function to get data from updated token
  function handleUpdateUser () {
    handleSignUpOrLogin ();
  }

  function handleLogout(){
    userService.logout();
    setUser({user: null})
  }

  return (
    <div className="App">
      <Switch>
          <Route exact path="/login">
             <LoginPage handleSignUpOrLogin={handleSignUpOrLogin}/>
          </Route>
          <Route exact path="/signup">
             <SignupPage handleSignUpOrLogin={handleSignUpOrLogin}/>
          </Route>
          <Route exact path="/onboarding">
             <OnBoardingPage />
          </Route>
          <Route exact path="/">
              <HomePage />
          </Route>
          { user  ?
            <Switch>
              <Route exact path="/dashboard">
                <DashboardPage handleLogout={handleLogout} user={user} />
              </Route>
              <Route exact path="/viewMessages">
                <ViewMessagesPage user={user} handleUpdateUser={handleUpdateUser} />
              </Route>
              <Route exact path="/messaging">
                <MessagePage user={user} handleUpdateUser={handleUpdateUser} />
              </Route>
              <Route exact path="/matching">
                <MatchingPage handleUpdateUser={handleUpdateUser} user={user} />
              </Route>
              <Route exact path="/requests">
                <RequestsPage handleUpdateUser={handleUpdateUser} user={user} />
              </Route>
            </Switch>
            :
            <Redirect to='/'/>
          }
          

      </Switch>
    </div>
  );
}

export default App;
