import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';

import './ViewMessagesPage.scss';
import userService from "../../utils/userService";
import CustomButton from "../../components/CustomButton/CustomButton";

export default function ViewMessagesPage ({ user, handleUpdateUser }) {

    const history = useHistory();

    function handleReturnToDashboard () {
        history.push('/dashboard');
    }

    function handleWriteMessage () {
        history.push('/messaging');
    }


    async function setMessagesAsViewed () {
        const viewedMessages = user.messages.map(msg => {
            return msg.receiver === user.username ? {...msg, viewed: true } : msg;
        })

        try {
            const updatedUser = {
                ...user,
                messages: viewedMessages
            }
            await userService.update(updatedUser);
            handleUpdateUser();
            history.push('/viewMessages');
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setMessagesAsViewed();
    }, []);

    return (
        <div id="viewmessagespage-container">
            <div id="otheruserinfo-container">{user.match ? user.match : 'No Match'}</div>
            <div id="allmessages-container">
                {
                    user.messages.map((message, index) => {
                        return (
                            message.sender === user.username ? <div className="userBubble" key={index}>{message.message}</div>
                            : <div className="otherUserBubble" key={index}>{message.message}</div>
                        )
                    })
                }
            </div>
            <div id="messagesbuttons-container">
                <CustomButton handleCustomClick={handleWriteMessage}>Write Message</CustomButton>
                <CustomButton handleCustomClick={handleReturnToDashboard}>Dashboard</CustomButton>
            </div>            
        </div>
    )
}