import React from 'react';

import './CustomButton.scss';

export default function CustomButton ({ handleCustomClick, disabled, children }) {
    return (
        <>
            {
                disabled ? <button className="custombutton-container disabled">{children}</button>
                : <button onClick={handleCustomClick} className="custombutton-container">
                    {children}
                </button>
            }
        </>
    )
}