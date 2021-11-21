import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";

import './DashboardPage.scss';
import userService from "../../utils/userService";

export default function DashboardPage ({ handleLogout }) {

  const [matches, setMatches] = useState([]);
  const [gotAllMatches, setGotAllMatches] = useState(false);
  const user = userService.getUser();
  const history = useHistory();

  if (!user) {
    history.push('/');
  }

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
      let { deletedCount } = await userService.deleteAll();
      console.log('Users deleted: ', deletedCount.deletedCount);
      handleLogoutClick();
    } catch (err) {
      console.log(err);
    }
  }

  // Retrieve all the users "that match"
  async function getAllUsers () {
    setGotAllMatches(true);
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
      return isMatch;
    });
    return filtered;
  }

  // Pull all users whenever dashboard renders
  useEffect(() => {
    if (!gotAllMatches)
      getAllUsers();
  })

  return (
      <div id="dashboardpage-container">
          <p>{user.username} was successfully created in the database</p>
          <p>{user.username} is matched with {user.match}</p>
          <p>There are {matches.length} matches</p>
          <button onClick={handleGetMatch}>Get Match</button>
          <button onClick={handleGoToMessaging}>Messaging</button>
          <button onClick={handleLogoutClick}>Logout</button>

          {/* Only for testing. Remove before deployment */}
          <button onClick={handleDeleteAllUsers}>Delete All</button>
      </div>
  )
}