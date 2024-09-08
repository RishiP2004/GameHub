import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import TopPlayers from './display/TopPlayers';
import PlayerStats from "./display/PlayerStats";
import UserLogin from "./auth/UserLogin";
import axios from "axios";
import GameSelection from "./selection/GameSelection";
import AIGame from "./game/ai/AIGame";
import PlayerGame from "./game/player/PlayerGame";
import UserRegister from "./auth/UserRegister";
import HomePage from './home/HomePage';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const guestMode = user === 0;
    const authToken = document.cookie.replace(/(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/, '$1');

    useEffect(() => {
        if (!authToken || guestMode) {
            setLoggedIn(guestMode);
        } else {
            axios.get('http://localhost:3001/verify-token', {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }).then(() => {
                setLoggedIn(true);
            }).catch((error) => {
                console.error('Token verification failed:', error);
                setLoggedIn(false);
            });
        }
    }, [authToken, guestMode]);


    return (
        <Router>
            <TopPlayers />
            <Switch>
                {/* HomePage Route */}
                <Route path="/" exact>
                    {loggedIn ? (
                        <>
                            <PlayerStats />
                            <GameSelection />
                        </>
                    ) : (
                        <HomePage />
                    )}
                </Route>
                {/* Game with player1 and player2 */}
                <Route path="/game/:player1/:player2">
                    {loggedIn ? (
                        <>
                            <PlayerStats />
                            <PlayerGame />
                        </>
                    ) : (
                        <Redirect to="/" />
                    )}
                </Route>

                {/* AI Game */}
                <Route path="/ai-game">
                    {loggedIn ? (
                        <>
                            <PlayerStats />
                            <AIGame />
                        </>
                    ) : (
                        <Redirect to="/" />
                    )}
                </Route>

                {/* Login Page */}
                <Route path="/login">
                    {loggedIn ? <Redirect to="/" /> : <UserLogin setLoggedIn={setLoggedIn} />}
                </Route>

                {/* Register Page */}
                <Route path="/register">
                    {loggedIn ? <Redirect to="/" /> : <UserRegister setLoggedIn={setLoggedIn} />}
                </Route>

                {/* Fallback redirect to home */}
                <Redirect to="/" />
            </Switch>
        </Router>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

export default App;
