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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (usernameInput === '' || password === '') {
            setError(true);
            return;
        }

        axios.post('/login', { username: usernameInput, password })
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
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="input"
                    />
                </label>
                <label className="label">
                    <p>Password</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                    />
                </label>
                <div>
                    <button type="submit" className="btn">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default UserLogin;
