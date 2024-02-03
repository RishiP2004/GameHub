import React, { useState } from 'react';
import './UserLogin.css';
import axios from "axios";
import { useHistory } from 'react-router-dom';

function UserLogin({ setLoggedIn, setUsername }) {
    console.log('Rendering UserLogin component');
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
                setUsername(usernameInput);
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