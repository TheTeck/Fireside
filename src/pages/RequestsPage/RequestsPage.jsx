import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import './RequestsPage.scss';
import userService from '../../utils/userService';
import MatchSelection from "../../components/MatchSelection/MatchSelection";
import NoMatches from "../../components/NoMatches/NoMatches";

export default function RequestsPage ({ handleUpdateUser, user }) {

  const location = useLocation();

  const [matchIndex, setMatchIndex] = useState(0);
  const [requesters, setRequesters] = useState(location.state.requesters);
  const history = useHistory();

  // Go through the array of matches
  function skipUser () {
    if (matchIndex < requesters.length - 1) {
      setMatchIndex(prev => prev + 1);
    } else {
      setMatchIndex(0);
    }
  }

  function removeRequest(user1, user2) {
     const cleanedUserRequests = user1.requests.filter(request => {
        return request.requester !== user2.username;
    });
    const cleanedOtherUserRequests = user2.requests.filter(request => {
        return request.requestee !== user1.username;
    });
    
    const updatedUser = {
        ...user1,
        requests: cleanedUserRequests
    };
    
    const updatedOtherUser = {
        ...user2,
        requests: cleanedOtherUserRequests
    }; 
    return [updatedUser, updatedOtherUser]
  }

  // User explicitly does not want this other user as a match, so
  // remove the request from both users' requests array
  async function declineUser (requestingUser) {
    const [updatedUser, updatedOtherUser] = removeRequest(user, requestingUser);
    
    try {
        await userService.update(updatedUser);
        await userService.update(updatedOtherUser);
        handleUpdateUser();
        history.push('./dashboard');
    } catch (error) {
        console.log(error);
    }
  }

  // Add the selected requester to the user data
  async function selectUser (user2) {

    const [updatedUser, updatedOtherUser] = removeRequest(user, user2);

    let fullyUpdatedUser = { 
      ...updatedUser,
      match: user2.username
    }

    let fullyUpdatedOtherUser = {
        ...updatedOtherUser,
        match: user.username
    }
    console.log('///', fullyUpdatedUser)
    try {
      await userService.update(fullyUpdatedOtherUser);
      await userService.update(fullyUpdatedUser);
      handleUpdateUser();
      history.push('/dashboard');
    } catch (err) {
      console.log(err);
    }
  }

    return (
      <div>
        {
          requesters.length ?
          <MatchSelection 
            selectUser={selectUser} 
            skipUser={skipUser} 
            declineUser={declineUser}
            match={ requesters[matchIndex]}
            header="New Requests"
            matchesLength={requesters.length}
          /> : <NoMatches />
        }
      </div>
        
    )
}