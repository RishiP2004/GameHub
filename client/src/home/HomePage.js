import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const history = useHistory();
    // Redirect to game selection if guest selected
    const handleGuestClick = (e) => {
        e.preventDefault();
        localStorage.setItem('user', JSON.stringify(0));
        history.push('/game-selection');
    };

    return (
        <div className="home-container">
            <h1>Welcome to R-Game Hub</h1>
            <p>Choose an option below to start playing!</p>
            <div className="home-buttons">
                <Link to="/login">
                    <button className="home-button login-button">Login</button>
                </Link>
                <Link to="/register">
                    <button className="home-button register-button">Register</button>
                </Link>
                <button className="home-button guest-button" onClick={handleGuestClick}>Play as Guest</button>
            </div>
        </div>
    );
}

export default HomePage;
