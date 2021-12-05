import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";

import './DashboardPage.scss';
import userService from "../../utils/userService";
import CustomButton from "../../components/CustomButton/CustomButton";

export default function DashboardPage ({ handleLogout, user }) {

  const [matches, setMatches] = useState([]);
  const [requests] = useState(getAllRequests());
  const [requesters, setRequesters] = useState([]);
  const [newMsgCount, setNewMsgCount] = useState(0);
  const history = useHistory();

  function handleGetMatch () {
    history.push({
      pathname: '/matching',
      state: { matches }
    });
  }

  function handleGoToRequests () {
    history.push({
      pathname: '/requests',
      state: { requesters }
    })
  }

  function handleGoToMessaging () {
    history.push('/messaging');
  }

  function handleGoToViewMessages () {
    history.push('viewMessages');
  }

  function handleLogoutClick () {
    handleLogout();
    history.push('/');
  }

  // Retrieve all the users "that match" and users that have sent a match request
  async function getAllUsers () {
    try {
      let data = await userService.getAll();
      let filteredMatchingUsers = filterMatchUsers(data.users);
      let filteredRequestingUsers = filterRequestUsers(data.users);
      setMatches(filteredMatchingUsers);
      setRequesters(filteredRequestingUsers);
    } catch (error) {
      console.log(error);
    }
  }

  function getAllRequests () {
    let allRequests = user.requests.filter(request => {
      return request.requestee === user.username
    });
    return [...new Set(allRequests)];
  }

  function filterRequestUsers(others) {
    return others.filter(other => {
      let include = false;
      requests.forEach(request => {
        if (request.requester === other.username)
          include = true;
      });
      return include;
    })
  }

  function filterMatchUsers (others) {
    let filtered = others.filter(other => {
      let isMatch = false
      user.ageRanges.forEach(range => {          
        if (other.age >= range.low && other.age <= range.high)
          isMatch =  true;
      });
      if (other.username === user.username)
        isMatch = false;
      return isMatch;
    });
    return filtered;
  }

  // Pull all users whenever dashboard renders
  useEffect(() => {
    getAllUsers();
  }, [])

  // Get the count of all unread messages
  if (user.messages.length) {
    let count = 0;
    user.messages.forEach(msg => {
      if (!msg.viewed && msg.receiver === user.username)
        count++;
    })
    if (count !== newMsgCount)
      setNewMsgCount(count);
  }

  return (
      <div id="dashboardpage-container">
          {
            user.match ? <p>You are matched with {user.match}</p> : <p>You are not matched with a user yet.</p>
          }
          <CustomButton handleCustomClick={handleGetMatch}>{user.match ? 'New Match' : 'Get Match'}</CustomButton>
          <div id="message-button-wrapper">
            {
              newMsgCount ? <div>{newMsgCount}</div> : ''
            }
            {
              user.messages.length ? <CustomButton handleCustomClick={handleGoToViewMessages} disabled={!user.match.length}>Messages</CustomButton>
              : <CustomButton handleCustomClick={handleGoToMessaging} disabled={!user.match.length}>Messages</CustomButton>
            }
            
          </div>
          <div id="message-button-wrapper">
            {
              requests.length ? <div>{requests.length}</div> : ''
            }
            <CustomButton handleCustomClick={handleGoToRequests} disabled={!requests.length}>Requests</CustomButton>
          </div>
          <CustomButton handleCustomClick={handleLogoutClick}>Logout</CustomButton>
      </div>
  )
}