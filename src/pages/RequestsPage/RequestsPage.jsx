import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import './RequestsPage.scss';
import MatchSelection from "../../components/MatchSelection/MatchSelection";
import NoMatches from "../../components/NoMatches/NoMatches";

export default function RequestsPage ({ handleUpdateUser, user }) {

  const location = useLocation();

  const [matchIndex, setMatchIndex] = useState(0);
  const requesters = location.state.requesters;
  const history = useHistory();

  // Go through the array of matches
  function skipUser () {
    if (matchIndex < requesters.length - 1) {
      setMatchIndex(prev => prev + 1);
    } else {
      setMatchIndex(0);
    }
  }

  // Add the selected requester to the user data
  async function selectUser ({ requester }) {
    // let updatedUser = { 
    //   ...user,
    //   match: requester
    // }

    // try {
    //   await userService.update(updatedUser);
    //   handleUpdateUser();
    //   history.push('/dashboard');
    // } catch (err) {
    //   console.log(err);
    // }
  }

    return (
      <div>
        {
          requesters.length ?
          <MatchSelection 
            selectUser={selectUser} 
            skipUser={skipUser} 
            match={ requesters[matchIndex]}
            header="New Requests"
          /> : <NoMatches />
        }
      </div>
        
    )
}