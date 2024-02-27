import React, { useState } from 'react';
import './UserRegister.css';
import axios from "axios";
/**
 * Registration component of the website
 * Considers server API to check if
 * username is not taken and password valid
 * from database. Stores cookie and token
 * once validated
 *
 * @param setLoggedIn
 * @returns {JSX.Element}
 * @constructor
 */
const UserRegister = ( setLoggedIn ) => {
    const [usernameInput, setUsernameInput] = useState("");
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);

    let errorMsg = "Please enter all the fields"
    const successMessage = () => {
        return (
            <div
                className="success"
                style={{
                    display: submitted ? "" : "none",
                }}
            >
                <h1>Successfully registered</h1>
            </div>
        );
    };
    const errorMessage = () => {
        return (
            <div
                className="error"
                style={{
                    display: error ? "" : "none",
                }}
            >
                <h1>errorMsg</h1>
            </div>
        );
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const digitRegex = /\d/;
        const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

        if (password.length < minLength) {
            return 'Password must be at least 8 characters long.';
        }

        if (!uppercaseRegex.test(password)) {
            return 'Password must contain at least one uppercase letter.';
        }

        if (!lowercaseRegex.test(password)) {
            return 'Password must contain at least one lowercase letter.';
        }

        if (!digitRegex.test(password)) {
            return 'Password must contain at least one numeric character.';
        }

        if (!specialCharRegex.test(password)) {
            return 'Password must contain at least one special character.';
        }
        return null;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name === "" || password === "") setError(true);
        const validationResult = validatePassword(password);

        if (validationResult) {
            setError(true);
            errorMsg = validationResult
        }
        axios.post('http://localhost:3001/register', { usernameInput, password })
            .then((response) => {
                const token = response.data.token;
                document.cookie = `authToken=${token}; path=/`;
                setLoggedIn(true);
                localStorage.setItem('user', JSON.stringify(usernameInput));
                history.push('/');
                setError(false);
                setSubmitted(true);
            }).catch((error) => {
            setSubmitted(false);
            console.error('Register failed:', error.response.data.error);
            setError(true);
        });
    };
    return (
        <div className="register-container">
            <h1>Register</h1>
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
                        onChange={e => setUsernameInput(e.target.value)}
                        className="input"
                    />
                </label>
                <label className="label">
                    <p>Password</p>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
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

export default UserRegister;