import React, { useState } from 'react';
import './UserLogin.css';
import axios from "axios";
import { useHistory } from 'react-router-dom';

/**
 * Login component of the website
 * Considers server API to check if
 * username and password are correct
 * from database. Stores cookie and token
 * once validated
 *
 * @param setLoggedIn
 * @returns {JSX.Element}
 * @constructor
 */
const UserLogin = ( setLoggedIn ) => {
    const [usernameInput, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:3001/login', { usernameInput, password })
            .then((response) => {
                const token = response.data.token;
                document.cookie = `authToken=${token}; path=/`;
                setLoggedIn(true);
                localStorage.setItem('user', JSON.stringify(usernameInput));
                history.push('/');
            }).catch((error) => {
            console.error('Login failed:', error.response.data.error);
        });
    };

    return (
        <div className="login-container">
            <h1>Please Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" value={usernameInput} onChange={e => setUsernameInput(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default UserLogin;