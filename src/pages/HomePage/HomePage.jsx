import React from 'react';
import { useHistory } from 'react-router-dom';

import './HomePage.scss';
import userService from '../../utils/userService';
import CustomButton from '../../components/CustomButton/CustomButton';

export default function HomePage(props) {

    const history = useHistory();

    function handleLoginClick () {
        history.push('/login');
    }

    function handleSignupClick () {
        history.push('/onboarding');
    }

    function handleGoToDash () {
        console.log(userService.getUser())
        history.push('/dashboard');
    }

    return (
       <div>
            <div className="container" style={{ backgroundImage: "url(/fireside.png)" } }>
                <div className="fuzz">
                    <h1 className="homepage-title">FIRESIDE</h1>
                    <h3 className="stupid-inspirational-quote">Making intergenerational connections</h3>
                </div>
                {
                    !userService.getUser() ? 
                        <div className="btn-container">
                            <CustomButton handleCustomClick={handleLoginClick}>Login</CustomButton>
                            <CustomButton handleCustomClick={handleSignupClick}>Signup</CustomButton> 
                        </div>
                    :   <div className="btn-container">
                            <CustomButton handleCustomClick={handleGoToDash}>Dashboard</CustomButton>
                        </div>                
                }
            </div>
        </div>
    )
}