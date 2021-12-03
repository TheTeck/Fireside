import React from 'react';

import './MatchSelection.scss';
import CustomButton from '../CustomButton/CustomButton';

export default function MatchSelection ({ selectUser, skipUser, declineUser, match, header, matchesLength }) {

    function formatInfo (arr) {
        let output = '';
        if (arr.length >= 2) {
            let frontArr = arr.slice(0, arr.length-1);
            let commaSeperatedArr = frontArr.join(', ');
            output = commaSeperatedArr + ' & ' + arr[arr.length-1];
        } else if (arr.length === 1)
            output = arr[0];
        return output;
    }

    function handleSkipMatch() {
        skipUser();
    }

    function handleNoMatch() {
        declineUser(match);
    }

    function handleSelectMatch () {
        selectUser(match);
    }

    let descriptions = match.description ? formatInfo(match.description) : '';
    let offerings = match.whatToOffer ? formatInfo(match.whatToOffer) : '';

    return (
        <div id="matchselection-container">
            <h1>{header}</h1>
            <div className="matchinfo-wrapper">
                <div className="match-name">{match.username}</div>
                <div className="match-info">
                    <div>{match.age} years old</div>
                    <div>{descriptions}</div>
                    <div>{ match.whatToOffer.length ? `Interested in ${offerings}`: ''}</div>
                </div>
            </div>
            <p>{`Would you like to chat with ${match.username}?`}</p>
            <CustomButton handleCustomClick={handleSelectMatch}>Yes</CustomButton>
            {
                matchesLength > 1 ? <CustomButton handleCustomClick={handleSkipMatch}>Skip</CustomButton>
                : <CustomButton handleCustomClick={handleNoMatch}>No</CustomButton>
            }
            
        </div>

    )
}