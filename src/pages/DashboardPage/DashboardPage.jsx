import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";

import './DashboardPage.scss';
import userService from "../../utils/userService";

export default function DashboardPage ({ handleLogout, user }) {

  const [matches, setMatches] = useState([]);
  const [newMsgCount, setNewMsgCount] = useState(0);
  const history = useHistory();

  function handleGetMatch () {
    history.push({
      pathname: '/matching',
      state: { matches }
    });
  }

  function handleGoToMessaging () {
    history.push('/messaging');
  }

  function handleLogoutClick () {
    handleLogout();
    history.push('/');
  }

  //// Only for testing database
  //// Remove before deployment
  async function handleDeleteAllUsers () {
    try {
      await userService.deleteAll();
      handleLogoutClick();
    } catch (err) {
      console.log(err);
    }
  }

  // Retrieve all the users "that match"
  async function getAllUsers () {
    try {
      let data = await userService.getAll();
      let filteredUsers = filterUsers(data.users);
      setMatches(filteredUsers);
    } catch (error) {
      console.log(error);
    }
  }

  function filterUsers (others) {
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
    let count = user.messages.reduce((acc, msg) => {
      return acc + (!msg.viewed && msg.receiver === user.username) ? 1 : 0;
    }, 0);
    if (count !== newMsgCount)
      setNewMsgCount(count);
  }

  return (
      <div id="dashboardpage-container">
          <p>{user.username} was successfully created in the database</p>
          <p>{user.username} is matched with {user.match}</p>
          <p>There are {matches.length} matches</p>
          <p>There are {newMsgCount} unread messages</p>
          <button onClick={handleGetMatch}>Get Match</button>
          <button onClick={handleGoToMessaging}>Messaging</button>
          <button onClick={handleLogoutClick}>Logout</button>

          {/* Only for testing. Remove before deployment */}
          <button onClick={handleDeleteAllUsers}>Delete All</button>
      </div>
  )
}