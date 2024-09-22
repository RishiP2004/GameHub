import React, { useState } from 'react';
import './UserRegister.css';
import axios from "axios";
import { useHistory } from 'react-router-dom';

/**
 * Register component of the website
 * Handles user registration by validating
 * input and communicating with server API
 * to create a new user account
 *
 * @param {Object} props
 * @param {Function} props.setLoggedIn - Function to set the logged-in state
 * @returns {JSX.Element}
 * @constructor
 */
const UserRegister = ({ setLoggedIn }) => {
    const [usernameInput, setUsernameInput] = useState("");
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const history = useHistory();

    const successMessage = () => (
        <div className="success" style={{ display: submitted ? "block" : "none" }}>
            <h1>Successfully registered</h1>
        </div>
    );

    const errorMessage = () => (
        <div className="error" style={{ display: error ? "block" : "none" }}>
            <h1>{errorMsg}</h1>
        </div>
    );

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

    const handlePasswordChange = (e) => {
        const passwordValue = e.target.value;
        setPassword(passwordValue);

        const validationResult = validatePassword(passwordValue);

        if (validationResult) {
            setError(true);
            setErrorMsg(validationResult);
        } else {
            setError(false);
            setErrorMsg('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (usernameInput === "" || password === "") {
            setError(true);
            setErrorMsg("Please enter all fields");
            return;
        }

        const validationResult = validatePassword(password);
        if (validationResult) {
            setError(true);
            setErrorMsg(validationResult);
            return;
        }

        axios.post('/api/register', { username: usernameInput, password })
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
                console.error('Registration error:', error.response ? error.response.data : error.message);
                setSubmitted(false);
                setError(true);
                setErrorMsg("Registration failed. Please try again.");
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
                        onChange={handlePasswordChange}
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
