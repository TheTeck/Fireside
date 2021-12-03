import React, { useState } from "react";
import { useHistory, useLocation } from 'react-router-dom';

import './MatchingPage.scss';
import userService from "../../utils/userService";
import MatchSelection from "../../components/MatchSelection/MatchSelection";
import NoMatches from "../../components/NoMatches/NoMatches";

export default function MatchingPage ({ handleUpdateUser, user }) {

  const location = useLocation();

  const [matchIndex, setMatchIndex] = useState(0);
  const matches = location.state.matches;
  const history = useHistory();

  // Go through the array of matches
  function skipUser () {
    if (matchIndex < matches.length - 1) {
      setMatchIndex(prev => prev + 1);
    } else {
      setMatchIndex(0);
    }
  }

  function declineUser () {
    history.push('/dashboard');
  }

  // Create a new request object in both users' requests property
  async function selectUser (user2) {
    let newRequest = {
      requester: user.username,
      requestee: user2.username
    }

    let userRequests = [...user.requests, newRequest];
    let updatedUser = { ...user, requests: userRequests };

    try {
      let otherUser = await userService.getOne(user2.username);

      let otherRequests = [...otherUser.user[0].requests, newRequest];
      let updatedOther = { ...otherUser.user[0], requests: otherRequests };
      await userService.update(updatedOther);
      await userService.update(updatedUser);
      handleUpdateUser();
      history.push('/dashboard');
    } catch (error) {
        console.log(error);
    }
  }

    return (
      <div>
        {
          matches.length ?
          <MatchSelection 
            selectUser={selectUser} 
            skipUser={skipUser} 
            declineUser={declineUser}
            match={ matches[matchIndex]}
            header="Here are your matches!"
            matchesLength={matches.length}
          /> : <NoMatches />
        }
      </div>
        
    )
}