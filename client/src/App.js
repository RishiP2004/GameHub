// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import TopPlayers from './display/TopPlayers';
import PlayerStats from "./display/PlayerStats";
import UserLogin from "./login/UserLogin";
import Game from "./game/Game";
import axios from "axios";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);
    /**
    useEffect(() => {
        const authToken = document.cookie.replace(/(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/, '$1');

        if (authToken) {
            axios.get('http://localhost:3001/verify-token', {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }).then(() => {
                setLoggedIn((prevLoggedIn) => !prevLoggedIn);
                const decodedToken = decodeURIComponent(atob(authToken.split('.')[1]));
                const { username } = JSON.parse(decodedToken);
                setUsername(username);
            }).catch((error) => {
                console.error('Token verification failed:', error);
            });

        }
    }, [setLoggedIn, setUsername]);
    */
    return (
        <Router>
            <Switch>
                <Route path="/login" exact element={<UserLogin setLoggedIn={setLoggedIn} setUsername={setUsername} />} />
                {loggedIn ? (
                    <LoggedInRoutes username={username} />
                ) : (
                    <Redirect to="/login" />
                )}
            </Switch>
        </Router>
    );
}



function LoggedInRoutes({ username }) {
    return (
        <React.Fragment>
            <Route path="/" element={<PlayerStats username={username} />} />
            <Route path="/top-players" element={<TopPlayers />} />
            <Route path="/game" element={<Game username={username} />} />
        </React.Fragment>
    );
}

export default App;