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

  // Add the selected match to the user data
  async function selectUser ({ match }) {
    // let updatedUser = { 
    //   ...user,
    //   match
    // }

    // try {
    //   await userService.update(updatedUser);
    //   handleUpdateUser();
    //   history.push('/dashboard');
    // } catch (err) {
    //   console.log(err);
    // }

    let newRequest = {
      requester: user.username,
      requestee: match
    }

    let userRequests = [...user.requests, newRequest];
    let updatedUser = { ...user, requests: userRequests };

    try {
      let otherUser = await userService.getOne(match);

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
            match={ matches[matchIndex]}
            header="Here are your matches!"
          /> : <NoMatches />
        }
      </div>
        
    )
}