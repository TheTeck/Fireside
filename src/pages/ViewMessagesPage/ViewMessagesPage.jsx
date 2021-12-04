import React, { useState } from "react";
import { useHistory } from 'react-router-dom';

import './ViewMessagesPage.scss';
import CustomButton from "../../components/CustomButton/CustomButton";

export default function ViewMessagesPage ({ user }) {

    const history = useHistory();

    function handleReturnToDashboard () {
        history.push('/dashboard');
    }

    return (
        <div id="viewmessagespage-container">
            <div id="otheruserinfo-container">{user.match ? user.match : 'No Match'}</div>
            <div id="allmessages-container">
                {
                    user.messages.map((message, index) => {
                        return (
                            message.sender === user.username ? <div className="userBubble">{message.message}</div>
                            : <div className="otherUserBubble">{message.message}</div>
                        )
                    })
                }
            </div>
            <div id="messagesbuttons-container">
                <CustomButton handleCustomClick={handleReturnToDashboard}>Dashboard</CustomButton>
            </div>            
        </div>
    )
}