import React, { useState } from 'react';
import './UserLogin.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const UserLogin = ({ setLoggedIn }) => {
    const [usernameInput, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const history = useHistory();

    const successMessage = () => (
        <div className="success" style={{ display: submitted ? 'block' : 'none' }}>
            <h1>Successfully logged in</h1>
        </div>
    );

    const errorMessage = () => (
        <div className="error" style={{ display: error ? 'block' : 'none' }}>
            <h1>Please enter all the fields</h1>
        </div>
    );

    const handleUsernameChange = (e) => {
        setUsernameInput(e.target.value);
        if (error) setError(false);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (error) setError(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Username:', usernameInput);
        console.log('Password:', password);

        if (usernameInput.trim() === '' || password.trim() === '') {
            setError(true);
            return;
        }

        axios.post('/api/login', { username: usernameInput, password })
            .then((response) => {
                const token = response.data.token;
                document.cookie = `authToken=${token}; path=/`;
                setLoggedIn(true);
                localStorage.setItem('user', JSON.stringify(usernameInput));
                history.push('/game-selection');
                setError(false);
                setSubmitted(true);
            })
            .catch((error) => {
                setSubmitted(false);
                console.error('Login failed:', error.response?.data?.error || error.message);
                setError(true);
            });
    };
    const handleBack = () => {
        history.push('/game-selection');
    };

    return (
        <div className="login-container">
            <h1>Log In</h1>
            <div className="messages">
                {errorMessage()}
                {successMessage()}
            </div>
            <form onSubmit={handleSubmit}>
                <label className="label">
                    <p>Username</p>
                    <input
                        type="text"
                        value={usernameInput}
                        onChange={handleUsernameChange}
                        className="input"
                    />
                </label>
                <label className="label">
                    <p>Password</p>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="input"
                    />
                </label>
                <div>
                    <button type="submit" className="btn">Submit</button>
                </div>
            </form>
            <div>
                <button className="btn" onClick={handleBack}>Back</button>
            </div>
        </div>
    );
};

export default UserLogin;
