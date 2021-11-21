import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import './MessagePage.scss';
import CustomButton from '../../components/CustomButton/CustomButton';
import userService from '../../utils/userService';

export default function MessagePage ({ user, handleUpdateUser }) {

    const [message, setMessage] = useState('');
    const [otherUser, setOtherUser] = useState({ 
        username: 'user'
    });

    const history = useHistory();

    function handleMessageChange (e) {
        setMessage(e.target.value);
    }

    // Create a new message object, then append it to the
    // array of messages of user (same array for otherUser)
    // Update the user objects with the appended array and
    // update users in database
    async function handleMessageSubmit () {
        let newMessage = { 
            sender: user.username, 
            receiver: otherUser.username, 
            message 
        };
        user = userService.getUser();
        let messages = [...user.messages, newMessage];

        let sender = { ...user, messages };
        let receiver = { ...otherUser, messages }
        
        try {
            await userService.update(receiver);
            await userService.update(sender);
            handleUpdateUser();
        } catch (error) {
            console.log(error);
        }
    }

    function handleBackClick () {
        history.push('./dashboard');
    }

    async function getOtherUser (match) {
        try {
            let other = await userService.getOne(match)
            setOtherUser(other.user[0]);
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getOtherUser(user.match);
    }, [user.match])

    return (
        <div id="messagepage-wrapper">
            <div id="messagepage-container">
                <h1>{`Connect with ${otherUser.username}`}</h1>
                <textarea name="message" value={message} onChange={handleMessageChange} rows="15"></textarea>
                <label htmlFor="message">Type a Message for them.</label>
                <CustomButton handleCustomClick={handleMessageSubmit}>Send</CustomButton>
                <CustomButton handleCustomClick={handleBackClick}>Back</CustomButton>
            </div>
        </div>
    )
}