import React, { useState } from "react";
import { useHistory, useLocation } from 'react-router-dom';

import './ViewMessagesPage.scss';
import CustomButton from "../../components/CustomButton/CustomButton";

export default function ViewMessagesPage (props) {

    const location = useLocation();
    const history = useHistory();
    const messages = location.state.messages

    function handleReturnToDashboard () {
        history.push('/dashboard');
    }

    return (
        <div id="viewmessagespage-container">
            <div id="otheruserinfo-container">Other user name</div>
            <div id="allmessages-container">

            </div>
            <div id="messagesbuttons-container">
                <CustomButton handleCustomClick={handleReturnToDashboard}>Dashboard</CustomButton>
            </div>            
        </div>
    )
}