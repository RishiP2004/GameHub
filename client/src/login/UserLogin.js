import React, { useState } from 'react';
import './UserLogin.css';
import {GetSocket} from "./SocketData";
import axios from "axios";
function UserLogin() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const { socketId } = GetSocket();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/user-login', { socketId, username, password });
            console.log('Login successful!', response.data);
            //todo: redirect to secondary page
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="login-container">
            <h1>Please Log In</h1>
            <form onSubmit={handleSubmit}> {}
                <label>
                    <p>Username</p>
                    <input type="text" value={username} onChange={e => setUserName(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <div>
                    <button type="submit">Submit onSubmit={e => handleSubmit(e)}</button>
                </div>
            </form>
        </div>
    );
}

export default UserLogin;
